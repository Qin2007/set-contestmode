// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit, RedditAPIClient, CreateWikiPageOptions, WikiPage } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

const COMMENT_JOB_NAME = 'delayed_comment';

Devvit.addSchedulerJob({
  name: COMMENT_JOB_NAME,
  onRun: async (event, context) => {
    const { id, commentBody } = event.data!, text = commentBody;
    if (typeof id !== 'string' || typeof text !== 'string') return;
    (await context.reddit.submitComment({ id, text, })).distinguish();
  },
});

Devvit.addMenuItem({
  location: 'post',
  label: 'Enable ContestMode',
  forUserType: 'moderator',
  onPress: async function (event, context) {
    context.ui.showToast('Hello!');
    const userId = context.userId, wikipageName = 'config/automoderator'; let user, username;
    if (userId !== undefined) { user = await context.reddit.getUserById(userId); username = user?.username; } else return;
    if (username === undefined) return;// weird i can fetch a user without name
    const postId = event.targetId, subreddit = await context.reddit.getCurrentSubreddit(), reddit = context.reddit;
    const wikiPage = await reddit.getWikiPage(subreddit.name, wikipageName), content: string = wikiPage.content;
    const automoderatorAddition = '\n\n---\n# set-contestmode\ntype: comment\nauthor:\n    name: set-contestmode'
      + '\nparent_submission:\n    set_contest_mode: true\n    action_reason: u/' + username + ' turned on contest' +
      ' mode.\naction_reason: u/' + username + ' turned on contest mode.\nbody (regex, full-exact): "u/[a-z0-9\\\\-_]+' +
      ` just enabled contest mode on your post"\nmoderators_exempt: false\n---`,
      commentBody = `u/${username} just enabled contest mode on your post`;
    await reddit.updateWikiPage({
      subredditName: subreddit.name,
      page: wikipageName, content: content + automoderatorAddition,
      reason: 'action_reason: u/' + username + ' turned on contest mode.',
    });
    await context.scheduler.runJob({
      name: COMMENT_JOB_NAME, data: { id: postId ?? null, commentBody },
      runAt: new Date(Date.now() + 2500), // 3 seconds from now
    });
  },
});

export default Devvit;
