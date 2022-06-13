# Prerequisites

If you haven't already done so: Please first see [the Implementer Documentation](https://wiki.openmrs.org/x/pQJiDQ), which provides some conceptual orientation as well as instructions for deployment and configuring.

Before developing OpenMRS Frontend 3.0, you should be familiar with the following technologies.

## Javascript

Knowing Javascript is prerequisite to everything else. Consider 
[Introduction to Javascript](https://www.codecademy.com/learn/introduction-to-javascript) and [The Modern JavaScript Tutorial](https://javascript.info/).

## JavaScript Tooling

You'll want to understand the basics of [npm](https://docs.npmjs.com/),
including the command-line interface (run `npm help`), [package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json), [`npx`](https://docs.npmjs.com/cli/v7/commands/npx), and know what [node](https://www.w3schools.com/nodejs/) is.

If the repository you're looking at has a `yarn.lock` file, then it uses `yarn`,
and you'll want to read the [Yarn docs](https://classic.yarnpkg.com/en/docs/getting-started).
Otherwise it uses `npm`. Yarn and npm are exclusive of each other within a repository.

### Lerna

Most OpenMRS 3 projects use Lerna. If the repository you're looking
at has a `packages` directory at the top level,
then it is a "monorepo" and is using Lerna, and you'll want to read the
[Lerna docs](https://github.com/lerna/lerna#readme).

## React

You should know everything from [React Main Concepts](https://reactjs.org/docs/hello-world.html),
and sections 1-5 of [React Hooks](https://reactjs.org/docs/hooks-intro.html).

If you're new to React, use a tutorial or interactive learner's guide.
The [Learn React Docs](https://beta.reactjs.org/learn) is an excellent resource.
You can also try the
[React Tutorial](https://reactjs.org/tutorial/tutorial.html)
or the video-based [React JS Crash Course 2021](https://www.youtube.com/watch?v=w7ejDZ8SWv8).

Take your time. This is a lot of material. The better you understand it, the more
easily you will be able to develop high-quality frontend modules (and other React applications).

### React Hooks
As mentioned above, you should definitely review sections 1-5 of [React Hooks](https://reactjs.org/docs/hooks-intro.html). Still looking for more videos? Some of our favorite videos are from when hooks first came out in 2018 - 2019. :clapper:[90% Cleaner React with Hooks](https://www.youtube.com/watch?v=wXLf18DsV-I), and
:clapper:[React Today and Tomorrow](https://youtu.be/dpw9EHDh2bM?t=1047). These do a good job of showing the difference before and after hooks. But before watching, you should have some experience with JavaScript and React in general to appreciate just how cool hooks are. :smile:

## TypeScript

You can get started with Typescript pretty quickly. If you're new to it,
please read [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

## Git

It is imperative that you keep your code in a version control system. OpenMRS uses
[Git](https://git-scm.com/). You should know the basics of using Git and GitHub.
The website [Learn Git Branching](https://learngitbranching.js.org/) and the video
[Git and GitHub for Beginners](https://www.youtube.com/watch?v=RGOj5yH7evk)
are excellent resources.
