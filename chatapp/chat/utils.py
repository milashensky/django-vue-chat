import re
import html


def build_content(content):
    content = '<br/>'.join([html.escape(i) for i in content.split('\n')])
    return build_links(content)


def build_links(text):
    if 'http' not in text:
        return text

    def linker(regexp):
        groups = list(regexp.groups())
        groups[2] = ''
        if groups[1].endswith('.'):
            groups[1] = groups[1][:-1]
            groups[2] = '.'
        return '{0}<noindex><a href="{1}" rel="nofollow" target="_blank">{1}</a></noindex>{2}'.format(*groups)

    text = re.sub('([^\"\'\(]?)(http[s]?\:\/\/[^\s\n\<\,]+)(\. )?', linker, text)
    return text
