import StoryblokClient, { ISbStoriesParams } from 'storyblok-js-client'

export default defineEventHandler(
  async (event): Promise<{ stories: Story[]; total: number }> => {
    const { spaceId, accessToken } = event.context.appSession as {
      spaceId: number
      accessToken: string
    }
	console.log('stories accessToken:', accessToken?.slice(0, 20))

    const storyblokClient = new StoryblokClient({
      oauthToken: `bearer ${accessToken}`,
    })

    let page = 1
    let allStories: Story[] = []
    let total = 0

    while (true) {
      const params: ISbStoriesParams = {
        version: 'published',
        per_page: 100,
        page,
		is_folder: false,
      }

      const { data, total: t } = await storyblokClient.get(
        `spaces/${spaceId}/stories`,
        params,
      )

      total = t
      const batch = (data.stories as Story[]).filter((story: any) => !story.is_folder)
      if (!batch || batch.length === 0) break
      allStories = [...allStories, ...batch]
      if (batch.length < 100) break
      page++
    }

    return {
      stories: allStories,
      total,
    }
  },
)