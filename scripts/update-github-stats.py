#!/usr/bin/env python3
"""Update the GitHub stat values in the profile SVGs."""

import json
import os
import re
import subprocess
from pathlib import Path


LOGIN = os.getenv("GITHUB_REPOSITORY_OWNER", "jackyissocute")
QUERY = """
query($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes { stargazerCount }
    }
    repositoriesContributedTo(
      first: 1
      contributionTypes: [COMMIT]
      includeUserRepositories: true
    ) { totalCount }
    contributionsCollection { totalCommitContributions }
    followers { totalCount }
  }
}
"""


def fetch_stats() -> dict[str, int]:
    response = subprocess.run(
        ["gh", "api", "graphql", "-f", f"query={QUERY}", "-F", f"login={LOGIN}"],
        check=True,
        capture_output=True,
        text=True,
    )
    payload = json.loads(response.stdout)
    if payload.get("errors"):
        raise SystemExit(payload["errors"])

    user = payload["data"]["user"]
    repositories = user["repositories"]
    return {
        "Repos": repositories["totalCount"],
        "Contributed": user["repositoriesContributedTo"]["totalCount"],
        # ponytail: first 100 repos; paginate if this account reaches 100.
        "Stars": sum(repo["stargazerCount"] for repo in repositories["nodes"]),
        "Commits": user["contributionsCollection"]["totalCommitContributions"],
        "Followers": user["followers"]["totalCount"],
    }


def update_svg(path: Path, stats: dict[str, int]) -> None:
    svg = path.read_text()
    for label, value in stats.items():
        pattern = rf'(<tspan class="key">{label}</tspan>.*?<tspan class="value">)\d+(</tspan>)'
        svg, replacements = re.subn(pattern, rf"\g<1>{value}\2", svg)
        if replacements != 1:
            raise SystemExit(f"Expected one {label} value in {path}, found {replacements}")
    path.write_text(svg)


stats = fetch_stats()
for svg_path in (Path("dark_mode.svg"), Path("light_mode.svg")):
    update_svg(svg_path, stats)
print(stats)
