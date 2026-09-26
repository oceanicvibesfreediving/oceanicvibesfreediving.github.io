"""Pelican configuration for the OceanicVibes blog layer."""

AUTHOR = "OceanicVibes"
SITENAME = "OceanicVibes"
SITEURL = "https://oceanicvibes.com"
PATH = "content"
OUTPUT_PATH = "output"
TIMEZONE = "America/Cancun"
DEFAULT_LANG = "en"

THEME = "themes/oceanicvibes"
ARTICLE_PATHS = ["articles"]
ARTICLE_SAVE_AS = "articles/{slug}.html"
ARTICLE_URL = "articles/{slug}.html"
INDEX_SAVE_AS = "articles.html"
# The curated journal index is the only archive page we want in search results.
AUTHOR_SAVE_AS = ""
CATEGORY_SAVE_AS = ""
TAG_SAVE_AS = ""
DIRECT_TEMPLATES = ["index"]
DEFAULT_PAGINATION = False
RELATIVE_URLS = False
