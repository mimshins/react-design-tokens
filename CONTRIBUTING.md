# Contributing to React Design Tokens

If you're reading this, you're definitely awesome!

The following is a set of guidelines for contributing to React Design Tokens,
which is hosted in the
[GitHub](https://github.com/mimshins/react-design-tokens). These are mostly
guidelines, not rules. Use your best judgment, and feel free to propose changes
to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](https://github.com/mimshins/react-design-tokens/blob/main/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

## A large spectrum of contributions

There are many ways to contribute to StylelessUi, code contribution is one
aspect of it. For instance, documentation improvements are as important as code
changes.

## Your first Pull Request

Working on your first Pull Request? You can learn how from this free video
series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

To help you get your feet wet and get you familiar with our contribution
process, we have a list of
[good first issues](https://github.com/mimshins/react-design-tokens/issues?q=is:open+is:issue+label:"good+first+issue")
that contain changes that have a relatively limited scope. This label means that
there is already a working solution to the issue in the discussion section.
Therefore, it is a great place to get started.

You can also work on any other issue you choose to. The "good first" issues are
just issues where we have a clear picture about their scope and timeline. Pull
requests working on other issues or completely new problems may take a bit
longer to review when they don't fit into our current development cycle.

If you decide to fix an issue, please be sure to check the comment thread in
case somebody is already working on a fix. If nobody is working on it at the
moment, please leave a comment stating that you have started to work on it so
other people don't accidentally duplicate your effort.

If somebody claims an issue but doesn't follow up for more than a week, it's
fine to take it over but you should still leave a comment. If there has been no
activity on the issue for 7 to 14 days, it is safe to assume that nobody is
working on it.

## Sending a Pull Request

StylelessUi is a community project, so Pull Requests are always welcome, but,
before working on a large change, it is best to open an issue first to discuss
it with the maintainers.

When in doubt, keep your Pull Requests small. To give a Pull Request the best
chance of getting accepted, don't bundle more than one feature or bug fix per
Pull Request. It's often best to create two smaller Pull Requests than one big
one.

1. Fork the repository.

2. Clone the fork to your local machine and add upstream remote:

```sh
git clone https://github.com/<your username>/react-design-tokens.git
cd react-design-tokens
git remote add upstream https://github.com/mimshins/react-design-tokens.git
```

3. Synchronize your local `main` branch with the upstream one:

```sh
git checkout main
git pull upstream main
```

4. Install the dependencies with `pnpm` (`npm` and `yarn` aren't supported):

```sh
pnpm install
```

5. Create a new topic branch:

```sh
git switch -c my-topic-branch
```

6. Make changes, commit and push to your fork:

```sh
git push -u origin HEAD
```

7. Go to [the repository](https://github.com/mimshins/react-design-tokens) and
   make a Pull Request.

The core team is monitoring for Pull Requests. We will review your Pull Request
and either merge it, request changes to it, or close it with an explanation.

### Development server

Start developing server and watch for code changes:

```sh
pnpm dev
```

The local dev server is a NextJS app. You can import codes and make changes to
`/app/page.tsx` page.

### Building

You can build the project, including all type definitions, with:

```sh
pnpm build
```

### Coding style

Please follow the coding style of the project. We use `prettier` and `eslint`,
so if possible, enable linting in your editor to get real-time feedback.

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 when improving the format/structure of the code
  - 🐎 when improving performance
  - 🚱 when plugging memory leaks
  - 📝 when writing/updating api docs
  - 🐛 when fixing a bug
  - 🚑️ when hotfixing a critical bug
  - ✨ when introducing new features
  - ⭐️ when adding new components
  - 🔥 when removing code or files
  - 🔖 when adding version tags
  - 🚨 when fixing compiler/linter warnings
  - 🚧 when the work is in progress
  - ♻️ when refactoring code
  - 🔧 when adding/updating configuration files
  - 🔨 when adding/updating development scripts
  - ✏️ when fixing a typo
  - 💩 when writing a bad code that needs to be improved
  - 👽️ when updating code due to external API changes
  - 🚚 when moving/renaming resources
  - 💥 when introducing breaking changes
  - 🍱 when adding/updating assets
  - ♿️ when improving accessibility
  - 🚸 when improving UX
  - 💄 when improving UI
  - ⚰️ when removing dead code
  - 🗑️ when deprecating code
  - 💚 when fixing the CI build
  - ✅ when adding tests
  - 🔒 when dealing with security
  - ⬆️ when upgrading dependencies
  - ⬇️ when downgrading dependencies

## License

By contributing your code to the this GitHub repository, you agree to license
your contribution under the MIT license.
