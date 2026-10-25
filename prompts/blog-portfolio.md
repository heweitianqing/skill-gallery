---
id: blog-portfolio
title: Personal blog and portfolio
version: 1
---
Build a personal website for Maya Lindqvist, a fictional freelance product designer and writer based in Gothenburg, Sweden. She designs software for people who work with data, and she writes a blog about her work. The site combines her portfolio and her blog on one page.

## Sections and content

1. **Header.** Her name "Maya Lindqvist" as the site title. Navigation links: Work, Writing, About, Contact. A control that switches between a light and a dark color scheme. On small screens the navigation must still be reachable.

2. **Introduction.** The statement "I design tools for people who work with data, and I write about how they get made." A status line: "Available for new projects from January 2027."

3. **Selected work.** Four case studies. Each shows the title, client, year, her role, a one-sentence summary, two or three tags, and an illustration made with inline SVG or CSS:
   - Tidepool: a field app for marine biologists that works offline on a boat. Client: Nordic Ocean Institute. 2026. Lead designer. Tags: Mobile, Offline, Research.
   - Ledger rewrite: replacing a 20-year-old member banking system for a community credit union. Client: Västkust Credit Union. 2025. Product designer. Tags: Finance, Forms, Accessibility.
   - Delay map: a live map of tram and bus delays for commuters and dispatchers. Client: Region Väst Transit. 2025. Design and front-end. Tags: Maps, Data visualization.
   - Open Data Handbook: a free guide for municipalities publishing their first datasets. Self-initiated. 2024. Author and designer. Tags: Writing, Open data.

4. **Writing.** A list of six posts. Each shows the date, title, reading time, a one-sentence excerpt and one tag. Add tag filters (All, Design, Data, Freelancing, Field notes) that filter the list.
   - 2 October 2026. "What a tide table taught me about empty states". 7 min. Design.
   - 11 September 2026. "Designing for gloves: touch targets in the field". 5 min. Field notes.
   - 20 August 2026. "Notes from rebuilding a 20-year-old banking form". 9 min. Design.
   - 3 July 2026. "Why I stopped using pie charts in client reports". 4 min. Data.
   - 28 May 2026. "A month of sketching on the tram". 6 min. Field notes.
   - 15 April 2026. "Pricing freelance work by the problem, not the hour". 8 min. Freelancing.
   Write the excerpts yourself.

5. **Featured post.** Show the first post, "What a tide table taught me about empty states", in full: title, date, reading time, and about 400 words of body text that you write. The body must include at least one subheading, one pull quote, and one short code or data snippet.

6. **About.** A biography of about 120 words that you write. An experience timeline:
   - 2019 to 2021: Designer, Kartverk Studio
   - 2021 to 2024: Senior product designer, Norrsken Analytics
   - 2024 to now: Independent
   A list of skills: Interaction design, Information design, Prototyping in code, Design systems, Workshop facilitation. Two talks: "Empty states are content" (Nordic Design Days, 2026) and "Forms that survive a migration" (Front-end Gothenburg, 2025).

7. **Newsletter.** Name: "Field Notes". Description: "A monthly email about designing with data. 1,900 readers." An email input and a "Subscribe" button.

8. **Contact and footer.** Email address maya@lindqvist.example. Text links to Mastodon, GitHub and Dribbble (they may point to `#`). Copyright line: "© 2026 Maya Lindqvist".

## Output requirements

- Write exactly one file named `index.html` in the current working directory. Put all HTML, CSS and JavaScript in that file.
- Do not reference remote images. Any images, icons or illustrations must be inline SVG or CSS.
- You may load fonts from Google Fonts and JavaScript or CSS libraries from well-known public CDNs (for example cdnjs, jsDelivr or unpkg).
- The page must work when `index.html` is opened directly from disk, and it must be usable at both desktop (1440px wide) and mobile (390px wide) viewport widths.
- All visible text is in English. Use the names, numbers and copy given above; write any additional copy a section needs.
- Do the whole task in one pass. Do not ask questions; make your own decisions and finish with the file written.
