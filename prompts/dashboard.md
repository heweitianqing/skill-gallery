---
id: dashboard
title: Data dashboard
version: 1
---
Build a sales and operations dashboard for Kestrel Coffee Roasters, a fictional coffee roaster that sells through an online store and four cafés. The dashboard is used by the operations lead every morning to see how October 2026 went compared with September 2026. Use only the data given below; do not invent other figures for the charts and tables.

## Layout and content

1. **Navigation.** A navigation area with the company name "Kestrel Coffee Roasters" and these items: Overview (the current page), Orders, Products, Customers, Inventory, Reports, Settings. On small screens the navigation must still be reachable.

2. **Top bar.** Page title "Sales & Operations", the period "October 2026", a search field with the placeholder "Search orders, products, customers", and the signed-in user "Mara Kim, Operations lead" shown with initials "MK".

3. **KPI cards** (October 2026, change versus September 2026):
   - Revenue: $184,320 (+6.4%)
   - Orders: 9,412 (+3.1%)
   - Average order value: $19.58 (+3.2%)
   - Subscription customers: 1,286 (+48 net)
   - Refund rate: 1.9% (−0.3 percentage points; a decrease is good)

4. **Monthly revenue chart**, November 2025 to October 2026, in thousands of US dollars, split by channel:

   | Month    | Online | Cafés |
   | -------- | -----: | ----: |
   | Nov 2025 | 61 | 88 |
   | Dec 2025 | 74 | 102 |
   | Jan 2026 | 58 | 81 |
   | Feb 2026 | 60 | 84 |
   | Mar 2026 | 63 | 89 |
   | Apr 2026 | 66 | 93 |
   | May 2026 | 68 | 97 |
   | Jun 2026 | 70 | 99 |
   | Jul 2026 | 72 | 96 |
   | Aug 2026 | 75 | 95 |
   | Sep 2026 | 79 | 94 |
   | Oct 2026 | 83 | 101 |

   Provide a control to show All channels, Online only, or Cafés only. Show the exact value for a month on hover or tap.

5. **Revenue by category** (October 2026, share of revenue): Whole bean 38%, Espresso drinks 27%, Filter & cold brew 14%, Pastries 12%, Equipment 6%, Gift cards 3%.

6. **Café performance table** (October 2026). The table must be sortable by clicking a column header.

   | Café | Revenue | Orders | Average ticket | Change vs Sep |
   | ---- | ------: | -----: | -------------: | ------------: |
   | Harbor Street | $31,420 | 1,812 | $17.34 | +4.8% |
   | Mill Lane | $27,960 | 1,655 | $16.89 | +2.1% |
   | Station Square | $24,310 | 1,498 | $16.23 | −1.7% |
   | Riverside (opened June 2026) | $17,630 | 1,127 | $15.64 | +9.6% |

7. **Top online products** (October 2026):

   | Product | Units | Revenue |
   | ------- | ----: | ------: |
   | Morning Tide blend, 340 g | 1,104 | $16,008 |
   | Ridgeback espresso, 1 kg | 412 | $14,420 |
   | Cold brew concentrate, 1 L | 655 | $9,170 |
   | Ceramic pour-over set | 138 | $6,210 |
   | Single-origin sampler | 291 | $5,529 |

8. **Recent orders:**

   | Order | Customer | Channel | Items | Total | Status |
   | ----- | -------- | ------- | ----: | ----: | ------ |
   | #48213 | Ana Ruiz | Online | 2 | $41.00 | Shipped |
   | #48212 | Tomás Berg | Harbor Street | 3 | $14.75 | Paid |
   | #48211 | Priya Nair | Online | 1 | $35.00 | Pending |
   | #48210 | Jonah Weiss | Mill Lane | 2 | $9.40 | Paid |
   | #48209 | Lena Okafor | Online | 4 | $63.50 | Refunded |
   | #48208 | Sam Choi | Riverside | 1 | $5.25 | Paid |

   The four statuses must be distinguishable from each other.

9. **Green coffee inventory** (days of stock left at the current roasting rate): Ethiopia Guji 6 days, Colombia Huila 14 days, Brazil Cerrado 3 days, Kenya Nyeri 21 days. Flag anything under 7 days as needing a reorder.

## Output requirements

- Write exactly one file named `index.html` in the current working directory. Put all HTML, CSS and JavaScript in that file.
- Do not reference remote images. Any images, icons or illustrations must be inline SVG or CSS.
- You may load fonts from Google Fonts and JavaScript or CSS libraries from well-known public CDNs (for example cdnjs, jsDelivr or unpkg). Charts may use inline SVG, canvas or a charting library from a CDN.
- The page must work when `index.html` is opened directly from disk, and it must be usable at both desktop (1440px wide) and mobile (390px wide) viewport widths.
- All visible text is in English. Use the names, numbers and copy given above; write any additional copy a section needs.
- Do the whole task in one pass. Do not ask questions; make your own decisions and finish with the file written.
