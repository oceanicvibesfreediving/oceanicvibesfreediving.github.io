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
DIRECT_TEMPLATES = ["index"]
DEFAULT_PAGINATION = False
RELATIVE_URLS = False
