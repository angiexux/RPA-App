"""
RPA Global South Intelligence OS — User Guide PDF Generator
Run with: py generate-guide.py
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import os

# ── Colours ──────────────────────────────────────────────────
DARK   = HexColor("#0f1e22")
GOLD   = HexColor("#c9922a")
LIGHT  = HexColor("#f8f9fa")
MUTED  = HexColor("#6b7a7b")
BORDER = HexColor("#e5e7eb")
WARN_BG = HexColor("#fff8e1")
WARN_BORDER = HexColor("#f59e0b")
TIP_BG  = HexColor("#f0fdf4")
TIP_BORDER = HexColor("#22c55e")
RED    = HexColor("#dc2626")
WHITE  = colors.white

PAGE_W, PAGE_H = A4
MARGIN_L = 2.2 * cm
MARGIN_R = 2.2 * cm
MARGIN_T = 2.0 * cm
MARGIN_B = 2.0 * cm

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "RPA_Platform_User_Guide.pdf")

# ── Styles ────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def sty(name, **kw):
    return ParagraphStyle(name, **kw)

S = {
    "body": sty("body", fontName="Helvetica", fontSize=9.5, leading=15, textColor=DARK, spaceAfter=6),
    "h1":   sty("h1",   fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=DARK, spaceAfter=10, spaceBefore=4),
    "h2":   sty("h2",   fontName="Helvetica-Bold", fontSize=11.5, leading=15, textColor=DARK, spaceAfter=6, spaceBefore=14),
    "eyebrow": sty("eyebrow", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=GOLD, spaceAfter=2),
    "code": sty("code", fontName="Courier", fontSize=8.5, leading=13, textColor=DARK,
                backColor=HexColor("#f0f4f5"), borderPad=8, spaceAfter=8, spaceBefore=4),
    "warn": sty("warn", fontName="Helvetica", fontSize=9, leading=13, textColor=HexColor("#92400e"), spaceAfter=4),
    "warn_title": sty("warn_title", fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=HexColor("#b45309")),
    "tip":  sty("tip",  fontName="Helvetica", fontSize=9, leading=13, textColor=HexColor("#166534"), spaceAfter=4),
    "footer": sty("footer", fontName="Helvetica", fontSize=7.5, textColor=MUTED, alignment=TA_CENTER),
    "toc_item": sty("toc_item", fontName="Helvetica", fontSize=10, leading=14, textColor=DARK),
    "cover_title": sty("cover_title", fontName="Helvetica-Bold", fontSize=30, leading=36, textColor=WHITE),
    "cover_sub": sty("cover_sub", fontName="Helvetica", fontSize=13, leading=18, textColor=HexColor("#d4d4d4")),
    "cover_meta": sty("cover_meta", fontName="Helvetica", fontSize=9, leading=13, textColor=HexColor("#a0a0a0")),
    "cover_eye": sty("cover_eye", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=GOLD),
    "step_num": sty("step_num", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=GOLD, alignment=TA_CENTER),
    "step_body": sty("step_body", fontName="Helvetica", fontSize=9.5, leading=14, textColor=DARK),
    "bullet": sty("bullet", fontName="Helvetica", fontSize=9.5, leading=14, textColor=DARK,
                  leftIndent=14, bulletIndent=0, spaceAfter=3),
}

# ── Header / Footer canvas ─────────────────────────────────────
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(num_pages)
            super().showPage()
        super().save()

    def draw_footer(self, page_count):
        page = self._pageNumber
        if page <= 2:  # skip cover + TOC
            return
        self.saveState()
        self.setFont("Helvetica", 7.5)
        self.setFillColor(MUTED)
        footer_txt = "RPA Global South Intelligence OS  —  Confidential  |  v1.0  |  April 2026"
        self.drawCentredString(PAGE_W / 2, 14 * mm, footer_txt)
        self.drawRightString(PAGE_W - MARGIN_R, 14 * mm, f"{page}")
        self.setStrokeColor(BORDER)
        self.setLineWidth(0.5)
        self.line(MARGIN_L, 17 * mm, PAGE_W - MARGIN_R, 17 * mm)
        self.restoreState()

# ── Cover page elements (background drawn via onFirstPage) ────
def cover_elements():
    elems = []
    elems.append(Spacer(1, 6*cm))
    elems.append(Paragraph("RPA INTELLIGENCE PLATFORM",
        ParagraphStyle("cov_eye", fontName="Helvetica-Bold", fontSize=8,
                       textColor=GOLD, spaceAfter=16)))
    elems.append(Paragraph("RPA Global South<br/>Intelligence OS",
        ParagraphStyle("cov_title", fontName="Helvetica-Bold", fontSize=30,
                       leading=36, textColor=WHITE, spaceAfter=14)))
    elems.append(Paragraph("Backend User Guide<br/>How to Update &amp; Maintain the Platform",
        ParagraphStyle("cov_sub", fontName="Helvetica", fontSize=14, leading=20,
                       textColor=HexColor("#d4d4d4"), spaceAfter=28)))
    elems.append(HRFlowable(width="100%", thickness=0.5,
                             color=HexColor("#3a5a5f"), spaceAfter=18))
    elems.append(Paragraph("Version 1.0  |  April 2026  |  Internal Use Only",
        ParagraphStyle("cov_meta", fontName="Helvetica", fontSize=9,
                       textColor=HexColor("#a0a0a0"), spaceAfter=0)))
    return elems

def on_first_page(canv, doc):
    canv.saveState()
    canv.setFillColor(DARK)
    canv.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canv.setFillColor(GOLD)
    canv.rect(0, 0, 5*mm, PAGE_H, fill=1, stroke=0)
    canv.restoreState()

def on_later_pages(canv, doc):
    # footer
    page = doc.page
    if page <= 2:
        return
    canv.saveState()
    canv.setFont("Helvetica", 7.5)
    canv.setFillColor(MUTED)
    canv.drawCentredString(PAGE_W/2, 14*mm,
        "RPA Global South Intelligence OS  —  Confidential  |  v1.0  |  April 2026")
    canv.drawRightString(PAGE_W - MARGIN_R, 14*mm, str(page))
    canv.setStrokeColor(BORDER)
    canv.setLineWidth(0.5)
    canv.line(MARGIN_L, 17*mm, PAGE_W - MARGIN_R, 17*mm)
    canv.restoreState()

# ── Helpers ───────────────────────────────────────────────────
def section_header(num, title):
    return [
        Paragraph(f"SECTION {num}", S["eyebrow"]),
        Paragraph(title, S["h1"]),
        HRFlowable(width="100%", thickness=2, color=GOLD, spaceAfter=12),
    ]

def h2(text):
    return Paragraph(text, S["h2"])

def body(text):
    return Paragraph(text, S["body"])

def code(text):
    # Escape HTML chars, preserve whitespace
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return Paragraph(f'<font face="Courier" size="8">{text}</font>',
                     ParagraphStyle("cb", fontName="Courier", fontSize=8, leading=12.5,
                                    backColor=HexColor("#f0f4f5"), borderPad=8,
                                    borderColor=HexColor("#d4dde0"), borderWidth=0.5,
                                    leftIndent=10, rightIndent=10,
                                    spaceAfter=10, spaceBefore=4, textColor=DARK,
                                    borderRadius=4))

def warn(title, text):
    return Table(
        [[Paragraph(f"<b>{title}</b>", S["warn_title"]),
          Paragraph(text, S["warn"])]],
        colWidths=[3*cm, AVAIL_W - 3*cm],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), WARN_BG),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("LINEBEFORE", (0, 0), (0, -1), 4, WARN_BORDER),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("SPAN", (0, 0), (0, -1)),
        ]),
        spaceAfter=10,
    )

def tip(text):
    return Table(
        [[Paragraph("<b>Tip:</b>", S["tip"]), Paragraph(text, S["tip"])]],
        colWidths=[3*cm, AVAIL_W - 3*cm],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), TIP_BG),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("LINEBEFORE", (0, 0), (0, -1), 4, TIP_BORDER),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]),
        spaceAfter=10,
    )

def step(num, text):
    return Table(
        [[Paragraph(str(num), S["step_num"]), Paragraph(text, S["step_body"])]],
        colWidths=[0.7*cm, AVAIL_W - 0.7*cm],
        style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (0, -1), 0),
            ("RIGHTPADDING", (0, 0), (0, -1), 8),
            ("LEFTPADDING", (1, 0), (1, -1), 0),
            ("BACKGROUND", (0, 0), (0, -1), DARK),
            ("ROUNDEDCORNERS", [3]),
        ]),
        spaceAfter=6,
    )

AVAIL_W = PAGE_W - MARGIN_L - MARGIN_R

def data_table(headers, rows, col_widths=None):
    data = [headers] + rows
    n = len(headers)
    cw = col_widths or [AVAIL_W / n for _ in headers]
    t = Table(data, colWidths=cw, repeatRows=1)
    ts = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ])
    t.setStyle(ts)
    return t

def mono(text):
    return f'<font face="Courier" size="8.5">{text}</font>'

def p(text): return Paragraph(text, S["body"])
def sp(n=6): return Spacer(1, n)

# ── Build story ───────────────────────────────────────────────
story = []

# ── Cover ──
story.extend(cover_elements())
story.append(PageBreak())

# ── TOC ──
story.append(Paragraph("Table of Contents", ParagraphStyle("toc_h", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=DARK, spaceAfter=16)))
story.append(HRFlowable(width="100%", thickness=2, color=GOLD, spaceAfter=16))

toc_items = [
    ("1", "Platform Architecture Overview", "3"),
    ("2", "Environment Variables & API Keys", "4"),
    ("3", "How to Add a New Country", "5"),
    ("4", "How to Update Scoring Data", "6"),
    ("5", "How to Modify Indicator Weights", "7"),
    ("6", "How to Update the Model Matrix", "8"),
    ("7", "Troubleshooting Common Issues", "9"),
    ("8", "Quick Reference Card", "10"),
]
for num, title, pg in toc_items:
    row_data = [[
        Paragraph(f'<font color="#c9922a"><b>{num}</b></font>', S["toc_item"]),
        Paragraph(title, S["toc_item"]),
        Paragraph(pg, ParagraphStyle("toc_pg", fontName="Helvetica", fontSize=10, textColor=MUTED, alignment=TA_RIGHT)),
    ]]
    t = Table(row_data, colWidths=[0.8*cm, AVAIL_W - 2*cm, 1.2*cm])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, HexColor("#d4d4d4")),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(t)

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 1
# ════════════════════════════════════
story += section_header(1, "Platform Architecture Overview")

story.append(h2("Tech Stack"))
story.append(data_table(
    [p("Layer"), p("Technology")],
    [
        [p("Framework"), p("Next.js 16.2.4 (App Router) with React 19")],
        [p("Language"), p("TypeScript")],
        [p("Styling"), p("Tailwind CSS v4")],
        [p("Charts"), p("Recharts")],
        [p("State Management"), p("Zustand")],
        [p("AI Integration"), p("Anthropic Claude API (claude-sonnet-4-5)")],
    ],
    [4*cm, AVAIL_W - 4*cm],
))

story.append(warn("Important:", f"There is no separate Python backend. All data lives in TypeScript files under {mono('lib/')}, and AI calls go through a Next.js API route at {mono('app/api/claude/route.ts')}."))

story.append(h2("Key Files & Directories"))
story.append(data_table(
    [p("File Path"), p("Purpose"), p("Edit Frequency")],
    [
        [p(mono("lib/mockData.ts")), p("Country profiles, pillar scores, model recommendations"), p("When adding/updating countries")],
        [p(mono("lib/scoring.ts")), p("Composite score formula and model recommendation logic"), p("When changing weights")],
        [p(mono("lib/moduleSeedData.ts")), p("CSO metrics, capital flows, seed data per country"), p("When updating operational data")],
        [p(mono("lib/regulatoryData.ts")), p("Regulatory risk profiles per country"), p("When policy changes")],
        [p(mono("app/api/claude/route.ts")), p("Server-side Claude API integration"), p("When changing AI prompts")],
        [p(mono(".env.local")), p("API keys — never commit to Git"), p("When rotating credentials")],
        [p(mono("components/modules/")), p("One .tsx file per page/module"), p("When editing UI")],
    ],
    [4.5*cm, AVAIL_W - 8.5*cm, 4*cm],
))

story.append(h2("The Four Pillars"))
story.append(data_table(
    [p("Pillar"), p("Weight"), p("Description"), p("Deep-dive Page")],
    [
        [p("<b>Policy</b>"), p("25%"), p("Regulatory environment, NGO law, tax incentives"), p(mono("/regulatory-risk"))],
        [p("<b>Capital Flows</b>"), p("30%"), p("International & domestic funding availability"), p(mono("/capital-flow"))],
        [p("<b>Infrastructure</b>"), p("25%"), p("Fiscal sponsors, intermediaries, re-grantors"), p(mono("/daf-monitor"))],
        [p("<b>Talent</b>"), p("20%"), p("Local staffing capacity, sector expertise"), p(mono("/major-funder-tracker"))],
    ],
    [3.5*cm, 2*cm, AVAIL_W - 9.5*cm, 4*cm],
))

story.append(h2("Composite Score Formula"))
story.append(code("composite = (policy x 0.25) + (capital x 0.30) + (infrastructure x 0.25) + (talent x 0.20)"))

story.append(h2("Model Recommendations (auto-generated from composite score)"))
story.append(data_table(
    [p("Score Range"), p("Recommended Model"), p("Indicator Colour")],
    [
        [p("4.0 or above"), p("Local Partner"), p("Green")],
        [p("3.0 – 3.99"), p("Hybrid"), p("Amber")],
        [p("2.0 – 2.99"), p("New Build"), p("Orange")],
        [p("Below 2.0"), p("Premature"), p("Red")],
    ],
    [4*cm, 5*cm, AVAIL_W - 9*cm],
))

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 2
# ════════════════════════════════════
story += section_header(2, "Environment Variables & API Keys")

story.append(p(f"<b>Location:</b> {mono('rpa-intel-os/.env.local')} — excluded from Git via {mono('.gitignore')}. Never commit this file."))
story.append(sp())

story.append(h2("Required Variables"))
story.append(code(
    "ANTHROPIC_API_KEY=sk-ant-api03-...      # Your Anthropic API key\n"
    "ANTHROPIC_MODEL=claude-sonnet-4-5       # Model version"
))

story.append(h2("How to Rotate the API Key"))
story.append(step(1, f"Go to <b>https://console.anthropic.com</b> &rarr; API Keys &rarr; Create new key"))
story.append(step(2, f"Open {mono('.env.local')} in any text editor (Notepad works) and replace the value of {mono('ANTHROPIC_API_KEY')}"))
story.append(step(3, f"Restart the dev server: press <b>Ctrl+C</b> in your terminal, then run {mono('npm run dev')} again"))
story.append(step(4, "Verify by clicking <b>Refresh (Claude)</b> on any module page — if highlights appear, the key is working"))

story.append(sp(8))
story.append(warn("Security rules:",
    "Never paste API keys into GitHub issues, Slack messages, or shared documents. "
    "Rotate keys every 90 days. The .env.local file must never be committed to Git."
))

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 3
# ════════════════════════════════════
story += section_header(3, "How to Add a New Country")

story.append(p(f"All country data lives in: {mono('lib/mockData.ts')}"))
story.append(sp(8))

story.append(step(1, f"<b>Add the country entry</b> to the {mono('allCountryAnalyses')} array in {mono('lib/mockData.ts')}:"))
story.append(code(
    "{\n"
    '  country: "Morocco",\n'
    '  continent: "Sub-Saharan Africa",  // or "Latin America" -- must match exactly\n'
    '  policy: {\n'
    '    score: 3.2,\n'
    '    justification: "Describe the policy environment in 1-2 sentences..."\n'
    '  },\n'
    '  capital: {\n'
    '    score: 3.8,\n'
    '    justification: "Describe capital flow maturity..."\n'
    '  },\n'
    '  infrastructure: {\n'
    '    score: 3.0,\n'
    '    justification: "Describe the intermediary ecosystem..."\n'
    '  },\n'
    '  talent: {\n'
    '    score: 3.5,\n'
    '    justification: "Describe local talent availability..."\n'
    '  },\n'
    '  fetchedAt: "2026-04-30T00:00:00Z",\n'
    '}'
))

_step2_text = ("<b>Add the flag emoji</b> to the " + mono('FLAG_MAP') +
               " constant in " + mono('components/modules/ExpansionScreener.tsx') +
               ":<br/>" + mono("Morocco: '[flag emoji]',"))
story.append(step(2, _step2_text))
story.append(step(3, f"<b>Add CSO metrics</b> to {mono('lib/moduleSeedData.ts')} (optional — the platform uses sensible defaults if omitted)."))
story.append(step(4, f"<b>Add a regulatory profile</b> to {mono('lib/regulatoryData.ts')} following the existing country pattern."))
story.append(step(5, f"<b>Test:</b> Run {mono('npm run dev')}, navigate to Expansion Screener, and confirm the new country card appears. Click through to Feasibility Scorecard to confirm all four pillars populate."))

story.append(sp(8))
story.append(warn("Continent values must match exactly:",
    'Only "Sub-Saharan Africa" and "Latin America" are currently supported. '
    'Any other value will cause the country to be invisible in the Expansion Screener.'
))
story.append(tip("The composite score and model recommendation are computed automatically from the four pillar scores — you do not need to calculate or hardcode them."))

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 4
# ════════════════════════════════════
story += section_header(4, "How to Update Scoring Data")

story.append(p("<b>Scenario:</b> A policy change has occurred (e.g., new NGO law enacted in Brazil)"))
story.append(sp(8))

story.append(step(1, f"<b>Open {mono('lib/mockData.ts')}</b> and find the relevant country entry. Update the pillar score and justification:"))
story.append(code(
    "policy: {\n"
    "  score: 3.8,   // was 3.5 -- updated after CL 227/2026 partial state adoption\n"
    '  justification: "9 of 26 states now exempt CSO donations under CL 227/2026 (Apr 2026). Federal framework unchanged."\n'
    "},"
))

story.append(step(2, f"<b>The composite score recalculates automatically.</b> No script is needed — {mono('lib/scoring.ts')} recomputes it in real time on every page load."))
story.append(step(3, f"<b>Update the {mono('fetchedAt')} timestamp</b> so users can see when the data was last reviewed:"))
story.append(code('fetchedAt: "2026-04-30T00:00:00Z"'))

story.append(step(4, f"<b>Save the file.</b> In dev mode, Next.js hot-reloads automatically. For production:"))
story.append(code("npm run build\nnpm run start"))

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 5
# ════════════════════════════════════
story += section_header(5, "How to Modify Indicator Weights")

story.append(warn("Warning:",
    "Changing weights alters composite scores for all 21 countries simultaneously. "
    "Always document the change with a rationale and date."
))

story.append(p(f"<b>Location:</b> {mono('lib/scoring.ts')}"))
story.append(sp(4))

story.append(h2("Current Weights"))
story.append(code(
    "export function computeComposite(\n"
    "  policy: number,\n"
    "  capital: number,\n"
    "  infrastructure: number,\n"
    "  talent: number\n"
    "): number {\n"
    "  return (policy * 0.25) + (capital * 0.30) + (infrastructure * 0.25) + (talent * 0.20);\n"
    "}"
))

story.append(h2("Example — Increasing Capital Weight Post-USAID Withdrawal"))
story.append(code(
    "export function computeComposite(\n"
    "  policy: number,\n"
    "  capital: number,\n"
    "  infrastructure: number,\n"
    "  talent: number\n"
    "): number {\n"
    "  // v1.1 -- 2026-04-30: Increased capital weight from 0.30 to 0.35\n"
    "  // Rationale: USAID withdrawal makes donor diversity the highest-priority variable\n"
    "  return (policy * 0.20) + (capital * 0.35) + (infrastructure * 0.25) + (talent * 0.20);\n"
    "}"
))

story.append(h2("Rules"))
for item in [
    f"Weights must sum to exactly <b>1.00</b>",
    f"Update the weight labels on pillar cards in {mono('components/modules/FeasibilityScorecard.tsx')} (search for \"25% weight\" etc.)",
    "Add a changelog comment in the code explaining the rationale",
    f"Rebuild for production: {mono('npm run build')}",
]:
    story.append(Paragraph(f"&bull;  {item}", S["bullet"]))

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 6
# ════════════════════════════════════
story += section_header(6, "How to Update the Model Matrix")

story.append(p(f"<b>Location:</b> {mono('components/modules/ModelMatrix.tsx')} — find the {mono('STATIC')} constant near the top of the file."))
story.append(p("The three expansion models (New Build, Hybrid, Local Partner) are each defined with these fields:"))
story.append(sp(4))

story.append(data_table(
    [p("Field"), p("Type"), p("Description")],
    [
        [p(mono("cost")), p("string"), p('Estimated setup cost range (e.g. "$800K–$2.5M")')],
        [p(mono("timeline")), p("string"), p("Months to operational readiness")],
        [p(mono("keyRisks")), p("string"), p("Primary regulatory and operational risks")],
        [p(mono("rpaIntensity")), p("string"), p("RPA oversight level required")],
        [p(mono("bestFit")), p("string"), p("Ideal country profile for this model")],
        [p(mono("precedent")), p("string"), p("Example organisations that have used this model")],
        [p(mono("riskLevel")), p("number (0–5)"), p("Execution risk score — drives the risk meter bar")],
    ],
    [4*cm, 3*cm, AVAIL_W - 7*cm],
))

story.append(h2("Example — Updating New Build Cost Range"))
story.append(code(
    '"New Build": {\n'
    '  cost: "$3.0M–$7.5M+ (legal entity, licenses, systems, launch team)",  // updated\n'
    '  riskLevel: 4.5,  // increased after observed market entry costs\n'
    '  // ... all other fields remain unchanged\n'
    '},'
))

story.append(p(f"To add a <b>fourth model</b>, add a new entry to both the {mono('MODELS')} array (line ~7) and the {mono('STATIC')} object, following the same structure as the existing three."))

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 7
# ════════════════════════════════════
story += section_header(7, "Troubleshooting Common Issues")

story.append(data_table(
    [p("Issue"), p("Likely Cause"), p("Fix")],
    [
        [p("Score shows 0 or NaN"), p(f"Missing or null pillar score in {mono('mockData.ts')}"), p("Check all 4 pillar scores are numbers, not undefined")],
        [p("New country not in Expansion Screener"), p("Wrong continent string"), p('Must exactly match "Sub-Saharan Africa" or "Latin America"')],
        [p("Refresh (Claude) returns error"), p(f"Invalid or expired {mono('ANTHROPIC_API_KEY')}"), p(f"Rotate key in {mono('.env.local')}, restart server")],
        [p("Refresh (Claude) returns 'Incomplete response'"), p("Claude returned partial JSON"), p(f"Edit the prompt for that action in {mono('app/api/claude/route.ts')} — add stricter JSON format instructions")],
        [p("Map iframe blank for new country"), p(f"{mono('getCountryMapEmbed()')} missing entry"), p(f"Add country to {mono('lib/countryGeo.ts')}")],
        [p("App won't start — port in use"), p("Another Next.js process already running"), p(f"Run: {mono('taskkill /F /IM node.exe')} (Windows) then retry")],
        [p("Build fails — TypeScript error"), p("Incorrect type in new country entry"), p("Ensure continent matches the union type and all scores are numbers")],
        [p("Report-Ready Analysis card missing"), p("ModuleClaudeRefresh not placed correctly"), p(f"Add {mono('<ModuleClaudeRefresh />')} immediately after the description paragraph")],
        [p("PowerShell blocks npm run dev"), p("Execution policy restriction"), p("Use Command Prompt (cmd) instead of PowerShell")],
    ],
    [4.5*cm, 4.5*cm, AVAIL_W - 9*cm],
))

story.append(h2("Still Stuck?"))
for item in [
    f"Check {mono('.next/dev/logs/next-development.log')} for detailed Next.js error traces",
    f"Run {mono('npm run build')} for a full TypeScript compile check — it shows all errors with line numbers",
    "Hard refresh the browser: <b>Ctrl+Shift+R</b> (clears the Next.js client cache)",
]:
    story.append(Paragraph(f"&bull;  {item}", S["bullet"]))

story.append(PageBreak())

# ════════════════════════════════════
# SECTION 8
# ════════════════════════════════════
story += section_header(8, "Quick Reference Card")

story.append(data_table(
    [p("Task"), p("File to Edit"), p("Notes")],
    [
        [p("Rotate API key"), p(mono(".env.local")), p("Restart dev server after change")],
        [p("Add a country"), p(mono("lib/mockData.ts")), p(f"Also add flag to {mono('ExpansionScreener.tsx')}")],
        [p("Update a pillar score"), p(mono("lib/mockData.ts")), p("Composite recalculates automatically")],
        [p("Change pillar weights"), p(mono("lib/scoring.ts")), p("Must sum to 1.00; update UI labels too")],
        [p("Update model matrix text"), p(mono("components/modules/ModelMatrix.tsx")), p(f"Edit the {mono('STATIC')} constant")],
        [p("Update regulatory profile"), p(mono("lib/regulatoryData.ts")), p("Follow existing profile structure")],
        [p("Update CSO / capital seed data"), p(mono("lib/moduleSeedData.ts")), p("Per-country override or default fallback")],
        [p("Change Claude AI prompt"), p(mono("app/api/claude/route.ts")), p(f"Find the {mono('action')} case and edit the prompt string")],
        [p("Rebuild for production"), p("Terminal"), p(f"{mono('npm run build')} then {mono('npm run start')}")],
    ],
    [4.5*cm, 5*cm, AVAIL_W - 9.5*cm],
))

story.append(h2("Running the App Locally"))
story.append(warn("Use Command Prompt (cmd), not PowerShell:",
    "PowerShell has execution policy restrictions that block npm scripts on this machine."
))
story.append(code(
    'cd "D:\\Rab stol\\ucheba\\2026 весна\\1. DUMP\\RPA spec new\\rpa-intel-os"\n'
    "npm run dev\n"
    "# Then open: http://localhost:3000"
))

# ── Build PDF ─────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUT,
    pagesize=A4,
    leftMargin=MARGIN_L,
    rightMargin=MARGIN_R,
    topMargin=MARGIN_T,
    bottomMargin=2.5 * cm,
    title="RPA Global South Intelligence OS — Backend User Guide",
    author="RPA",
    subject="Platform maintenance guide",
)

doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)
print(f"PDF written to: {OUT}")

