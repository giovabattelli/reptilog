# Reptilog

![logo]

> An AI-enabled changelog inspired by Greptile. Built with [Probot](https://github.com/probot/probot).

## Decision Rationale
### Developer-facing design choices

A big decision for me was how and when to create a changelog entry. Initially, I wanted to make it such that a developer could create a GitHub issue with a special tag, which would summon the reptilog and create the changelog for all of the commits between the most recent commit and the last changelog. I eventually settled on having the GitHub bot automatically create a changelog based on the commits of a pull-request. 

A lot of companies operate with a "main development" branch, to which everyone merges their own branch changes onto. When an official release is made, a pull request is created from the "main development" branch to the main branch, in order to make things available to the users of the product. This is a clean and efficient solution that allows for very clear boundaries of a product's versioning. Conveniently, these pull-requests to a production branch create a nice partitioning that works well for changelogs too. In the context of a customer-facing API: when would you need to deploy your production branch without notifying your users of incoming changes? For the most part I think the answer to that question is "never". Thus, I think it was the better route to take, as supposed to the arbitrary nature of creating a changelog at any random time via the human creation of a GitHub issue with a specific tag.

### Public-facing design choices
For the public, 

## License

[ISC](LICENSE) © 2025 Giovanni Assad

[logo]: https://github.com/giovabattelli/reptilog-full/reptilog-icon.png "Reptilog"
