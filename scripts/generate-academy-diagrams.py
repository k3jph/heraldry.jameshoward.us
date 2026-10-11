"""Original schematic teaching diagrams, not historical arms or grants.

Run from any directory with Python 3. No third-party assets or dependencies.
Desktop and mobile are independently composed, preserving readable labels.
"""
from pathlib import Path
from html import escape
from math import cos, sin, pi

DEST = Path(__file__).resolve().parents[1] / 'public/images/academy'
INK = '#3a1726'
BLUE = '#235580'
RED = '#a83543'
GOLD = '#e9bc57'
WHITE = '#fffdf8'
SHIELD = 'M 0 0 H 150 V 80 C 150 130 115 162 75 188 C 35 162 0 130 0 80 Z'


def star(x, y, color, radius=17):
    pts = []
    for n in range(10):
        angle = -pi / 2 + n * pi / 5
        r = radius if n % 2 == 0 else radius * .42
        pts.append(f'{x+r*cos(angle):.2f},{y+r*sin(angle):.2f}')
    return f'<polygon points="{" ".join(pts)}" fill="{color}"/>'


def key(x, y, horizontal=False):
    rotation = f' rotate(90 {x} {y})' if horizontal else ''
    return (f'<g transform="translate(0 0){rotation}" fill="none" stroke="{BLUE}" stroke-width="5">'
            f'<circle cx="{x}" cy="{y-16}" r="8"/>'
            f'<path d="M{x} {y-8} V{y+20} h10 v-7"/></g>')


def panel(kind, number):
    clip = f'clip-{kind}-{number}'
    s = f'<defs><clipPath id="{clip}"><path d="{SHIELD}"/></clipPath></defs>'
    s += f'<path d="{SHIELD}" fill="{WHITE}"/>'
    if kind == 'geometry':
        if number == 0:
            s += f'<g clip-path="url(#{clip})"><rect x="0" y="92" width="150" height="110" fill="{RED}"/></g>'
        elif number == 1:
            s += f'<g clip-path="url(#{clip})"><rect x="0" y="67" width="150" height="48" fill="{RED}"/></g>'
        else:
            s += ''.join(star(x, 86, BLUE) for x in (30, 75, 120))
    elif kind == 'ordinary':
        # Neutral schematic: gray band and blue figures emphasize structure.
        if number < 2:
            s += f'<g clip-path="url(#{clip})"><path d="M-22 -10 L190 180" stroke="#b6b0a8" stroke-width="45"/></g>'
        coords = ((27, 35), (75, 78), (123, 121)) if number != 1 else ((114, 30), (28, 112), (69, 144))
        s += ''.join(star(x, y, BLUE, 14) for x, y in coords)
    elif kind == 'orientation':
        if number == 0:
            s += ''.join(key(x, 84) for x in (30, 75, 120))
        elif number == 1:
            s += ''.join(key(75, y, True) for y in (40, 85, 130))
        else:
            s += ''.join(key(75, y) for y in (35, 90, 145))
    elif kind == 'marshalling':
        s += f'<g clip-path="url(#{clip})">'
        if number == 0:
            s += f'<rect width="75" height="200" fill="{BLUE}"/>'
            s += star(38, 76, GOLD, 23)
            s += f'<circle cx="112" cy="77" r="22" fill="{RED}"/>'
        elif number == 1:
            s += f'<rect width="75" height="94" fill="{BLUE}"/><rect x="75" y="94" width="75" height="94" fill="{BLUE}"/>'
            s += star(38, 46, GOLD, 18) + star(112, 129, GOLD, 18)
            s += f'<circle cx="112" cy="46" r="17" fill="{RED}"/><circle cx="38" cy="129" r="17" fill="{RED}"/>'
        else:
            s += f'<rect width="75" height="94" fill="{BLUE}"/><rect x="75" y="94" width="75" height="94" fill="{BLUE}"/>'
        s += '</g>'
    s += f'<path d="{SHIELD}" fill="none" stroke="{INK}" stroke-width="2"/>'
    return s


SETS = {
    'geometry-operations': ('geometry', 'Three horizontal operations', [
        ('Per fess', 'Divide the field'), ('A fess', 'Place one band'), ('In fess', 'Arrange three figures')]),
    'ordinary-relationships': ('ordinary', 'A diagonal is not always a band', [
        ('On a bend', 'Figures lie on the band'), ('Around a bend', 'Figures lie in the field'), ('In bend', 'A group; no band')]),
    'orientation-arrangement': ('orientation', 'Orientation and arrangement', [
        ('Upright keys', 'A horizontal group'), ('Horizontal keys', 'A vertical group'), ('Upright keys', 'A vertical group')]),
    'marshalling-operations': ('marshalling', 'Compartment and component', [
        ('Impalement', 'Two complete designs'), ('Quartering', 'Two designs repeated'), ('Quarterly field', 'One divided design')]),
}


def make(name, kind, title, labels, mobile):
    width, height = (360, 1010) if mobile else (720, 390)
    body = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
            f'<title id="title">{escape(title)}</title>',
            '<desc id="desc">Original constructed teaching comparison. Each panel has a shield and its structural description.</desc>',
            f'<rect width="{width}" height="{height}" fill="#f5eee3"/>',
            f'<g fill="{INK}" font-family="DejaVu Sans, sans-serif" text-anchor="middle">',
            f'<text x="{width/2}" y="34" font-size="{16 if mobile else 21}" font-weight="700">{escape(title)}</text>']
    for n, (label, detail) in enumerate(labels):
        x, y = (105, 72 + n * 304) if mobile else (45 + n * 240, 86)
        body += [f'<g transform="translate({x} {y})">{panel(kind, n)}</g>',
                 f'<text x="{x+75}" y="{y+222}" font-size="18" font-weight="700">{escape(label)}</text>',
                 f'<text x="{x+75}" y="{y+249}" font-size="13">{escape(detail)}</text>']
    body += ['</g></svg>']
    (DEST / f'{name}{"-mobile" if mobile else ""}.svg').write_text('\n'.join(body) + '\n')


if __name__ == '__main__':
    DEST.mkdir(parents=True, exist_ok=True)
    for name, (kind, title, labels) in SETS.items():
        for mobile in (False, True):
            make(name, kind, title, labels, mobile)
