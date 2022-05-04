# Contributing

You can build the UI features that you need for your implementation.
However, it can be more fun and fruitful to collaborate on frontend
modules that can be useful to organizations around the world.

## Getting Connected

If you're interested in contributing, you'll need to take the following steps.

- Get access to [OpenMRS Jira](https://issues.openmrs.org).
    If you don't have access, raise a request at the
    [Help Desk](https://wiki.openmrs.org/display/~helpdesk).
    Wait at least 24 hours for the request to get approved; you will receive an
    email upon approval. Once approved, take a look at all the
    [frontend module-related issues](https://issues.openmrs.org/projects/MF/issues).
    Good first issues are filed under the
    [intro](https://issues.openmrs.org/browse/MF-508?jql=project%20%3D%20MF%20AND%20resolution%20%3D%20Unresolved%20AND%20labels%20%3D%22intro%22%20ORDER%20BY%20priority%20DESC%2C%20updated%20DESC)
    label.
- Join our [Slack Channel](https://openmrs.slack.com/archives/CHP5QAE5R) and introduce yourself.
You will first need to [create an OpenMRS Slack account](https://slack.openmrs.org/) if you don't have one.

## Guidelines for Contributing

#### Pull requests (PRs) are not required to correspond to a ticket.

If there is a ticket for the PR, it should be clearly named and linked in the PR.

#### Push additional commits.

Pull requests are allowed (and encouraged) to contain more than one commit.
Those commits are squashed when merged into master/main.

#### Do not close a PR and recreate a new one with the same code.

If you have opened a PR for some work and a reviewer has requested some changes,
do not open a new PR with the updates and close the old one. This makes things
very hard for reviewers.

#### Read and fill out the PR template.

That's all.

#### Work incrementally.

Smaller PRs are easier to read and validate. Opening multiple PRs for the same ticket
is excellent if those PRs represent different pieces or stages of work relating
to that ticket.

#### Do not increase the scope of a PR after it has been reviewed.

If your code has been reviewed, don't push a bunch more code that isn't related to
the review. Fixups are fine, but new features should have their own PRs.
Remember—small PRs are easier to review anyway!

#### Your first PR to a codebase should be small.

Get a feel for what the reviewer expects before submitting a PR with a large amount of code in it.

#### Your PR title should indicate the type of change it is.

We use PR titles to determine version bumps. PR titles should start with something
in parentheses, or the word `BREAKING`. Examples of good PR titles:

- "(docs) Add to contributing docs"
- "(fix) Console error when visiting allergies page"
- "(feat) Add search bar to medications widget"
- "(refactor) Tidy the dashboard implementation"
- "BREAKING: New left nav system"

Common prefixes include the above, and `chore`, `style`, `perf`, and `test`.

The versioning bump to indicate is based on the
[OpenMRS Frontend 3.0 versioning conventions](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0022-versions.md).
*Don't worry if you aren't sure which one you should use!* Your reviewer should make
sure your PR has an appropriate one.

## Guidelines for Reviewing

- Encourage feedback as both an author and reviewer.
- Encourage as many contributors to engage in deep and meaningful contribution.
- Be sensitive to the varying experience levels of OpenMRS contributors.
- Avoid gatekeeping, which includes over-emphasizing to contributors how they're failing to follow the correct process.
- Encourage code ownership, including reviewing changes to the code and projects you've contributed to.
- Provide detailed and helpful feedback to contributors, including using GitHub's
  [suggestion feature](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/incorporating-feedback-in-your-pull-request)
  to help the contributor know how to make the needed changes.

---

*The above guidelines were established in [RFC-20](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0020-contributing-guidelines.md).*


## Code Conventions

### Filenames

Above all, maintain consistency with the repository you are working in.

Our general conventions are these:

- The React component `FooBar` should be called `foo-bar.tsx` or `foo-bar.component.tsx`.
- The style file for `FooBar` should be called `foo-bar.[s]css` or `foo-bar.style.[s]css`.
- `FooBar` should not handle API calls itself, rather it should use functions that fetch
  and clean the data as needed. Those functions should be in a file called `foo-bar.resource.ts`.
- The tests for `FooBar` should be in a file called `foo-bar.test.tsx`.
- Avoid calling things "utils." It is a meaningless name. Group the functions by what
  they are for. If the function is only used in one place, just put it in the file
  where it is used.

### Naming things

Use the [Naming Cheatsheet](https://github.com/kettanaito/naming-cheatsheet#readme).
