Help me redesign my website to contain more content and help show the arc of my career.
This will be deployed to https://dhimmel.com.

I'm thinking of a single page app with anchor scrolling with the following structure:

- a sticky navbar at the top linking to sections of the page as well as the external blog.dhimmel.com
- a hero section with my name (Daniel Himmelstein, PhD) and a tagline (digital craftsman of the biodata revolution). Also a spot for me a add a headshot (circle cropped, square thumbnail).
- a short about
- portfolio, which is a carousel of my projects. Each project will have a square thumbnail, title, and description and an optional year range.
- experience, which is a timeline view of my CV
- contact, currently in the about page
- footer, contains the outlinks with SVG icons currently on the landing page

I am giving you my CV at @Daniel-Himmelstein-CV.tex.
And this repo contains the old site.
I am serving this repo with:

```
python3 -m http.server --directory=output 3001
```

Use your browser to poke around.

We will be getting rid of the about page and going single page scrolling.
The entire background should no longer be a huge picture of me.

Here are some projects for the carousel (along with my notes on the content)

- AI & automation in radiology: includes RadOverlay
- Software: links to popular GitHub repos
- Open manuscripts: includes Manubot, publishing delays
- Collaborative real-time science: includes deep review, Thinklab, GitHub
- Ontologies: nxontology, nxontology-data, MeSH
- Bibliometrics: includes Sci-Hub, publication delays
- Target-disease discovery: includes Related Sciences
- Drug repurposing: includes Rephetio
- Knowledge graphs: includes Hetionet
- DeSci: includes OpenTimeStamps blog, Thinklab
- OpenStreetMap & GIS: OpenSkiStats, Long Trail blog
- Elevation & Lung Cancer

Do not worry about synthesizing any new images.
You can make it so I can add the thumbnails to portfolio, but you do not have to create them.

Let's go with a dark theme with some nice beautiful gradients.
I like dark purples, greens, pinks, and whites.
But do whatever is artful, elegant, and beautiful.
