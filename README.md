# Source for dhimmel.com

Source code for <https://dhimmel.com>

This site is hosted on GitHub Pages.
Deployment of the `output` directory to GitHub Pages is handled by GitHub Actions using a workflow dispatch trigger.

When writing prose in HTML or markdown, use one sentence per line rather than the more common wrap at a character limit.
This helps maintain sensible git diffs.

Local development:

```shell
python3 -m http.server --directory=output 3001
```

Then visit <http://localhost:3001>.

## Known issues

