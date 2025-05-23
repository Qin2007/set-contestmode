# [set-contestmode](https://developers.reddit.com/apps/set-contestmode)

a hacky annoying solution to turn on contest mode on posts

to use it simply select the menu option on a post and let it work.

important: automoderator config must be made as a wiki page for this bot to work,
the automoderator config must be indented with 4 spaces.
if you have nothing to insert then `---` is enough to get started

## internals, important maybe.

when a moderator selects the menu option, the bot will go into the automoderator config and pastes

```yaml
---
# set-contestmode
type: comment
author:
    name: set-contestmode
parent_submission:
    set_contest_mode: true
    action_reason: u/Vast_Attention595 turned on contest mode.
action_reason: u/Vast_Attention595 turned on contest mode.
body (regex, full-exact): "u/[a-z0-9\\-_]+ just enabled contest mode on your post"
action: remove

---
```

in it, where `u/Vast_Attention595` is the username of the initiator.
then leaves a top level comment to have automoderator enable contest mode.

# sourced  openess

[this app is open source, view the source here](https://github.com/Qin2007/set-contestmode)

## changelog

- 0.1.1: automoderator does not remove comments anymore. but the comment that the bot makes will be distinguished.
