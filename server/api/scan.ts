import { getManagementBaseUrl, getRegion } from '@storyblok/region-helper'

export default defineEventHandler(async (event) => {
    const { spaceId, accessToken } = event.context.appSession as {
        spaceId: number
        accessToken: string
    }

    const region = getRegion(spaceId)
    if (!region) {
        throw createError({ statusCode: 500, message: 'Could not determine region' })
    }
    const apiHost = getManagementBaseUrl(region)
    const headers = { Authorization: `Bearer ${accessToken}` }

    // Get space languages
    const spaceInfo = await fetchSpaceInfo({ spaceId, accessToken })
    const languages: string[] = (spaceInfo.result?.space?.languages ?? []).map(
        (l: any) => l.code,
    )

    // Fetch all published stories paginated
    let page = 1
    let allStories: any[] = []

    while (true) {
        const res = await $fetch<any>(`${apiHost}/v1/spaces/${spaceId}/stories`, {
            headers,
            query: {
                per_page: 100,
                page,
                is_published: 1,
            },
        })
        const batch = (res.stories as any[]).filter((s: any) => !s.is_folder && s.published_at && !s.unpublished_changes)
        if (!batch || batch.length === 0) break
        allStories = [...allStories, ...batch]
        if (batch.length < 100) break
        page++
    }

    const gaps: any[] = []

    for (const story of allStories) {
        // Fetch full story to get translated_stories
        const fullRes = await $fetch<any>(
            `${apiHost}/v1/spaces/${spaceId}/stories/${story.id}`,
            { headers },
        )
        const fullStory = fullRes.story
        const translatedStories: any[] = fullStory.translated_stories ?? []

        //console.log(`${story.full_slug} translated_stories:`, JSON.stringify(translatedStories))

        for (const lang of languages) {
            const translation = translatedStories.find((t: any) => t.lang === lang)

            if (!translation) {
                gaps.push({
                    storyId: story.id,
                    storyName: story.name,
                    slug: story.full_slug,
                    language: lang,
                    status: 'never_published',
                    defaultPublishedAt: story.published_at,
                    translationPublishedAt: null,
                })
            } else if (translation.unpublished_changes) {
                gaps.push({
                    storyId: story.id,
                    storyName: story.name,
                    slug: story.full_slug,
                    language: lang,
                    status: 'out_of_date',
                    defaultPublishedAt: story.published_at,
                    translationPublishedAt: translation.published_at,
                })
            } else {
                gaps.push({
                    storyId: story.id,
                    storyName: story.name,
                    slug: story.full_slug,
                    language: lang,
                    status: 'published',
                    defaultPublishedAt: story.published_at,
                    translationPublishedAt: translation.published_at,
                })
            }
        }
    }

    return {
        total: allStories.length,
        gaps,
    }
})