# 📘 PORTFOLIO LAYOUT SYSTEM --- MASTER RULE FILE

------------------------------------------------------------------------

## 1. SYSTEM OVERVIEW

This portfolio uses:

-   Static HTML pages
-   Shared navbar and footer
-   Single global stylesheet: `css/min.css`
-   Webflow runtime scripts
-   `parallax.js`
-   `main.js` (primary JS logic)
-   Optional CircleType
-   Webflow class system (`w-nav`, `w-container`, etc.)

This system must remain visually and structurally consistent across all
pages.

------------------------------------------------------------------------

# 2. CANONICAL SOURCE FILES

These files define the system and must be treated as the source of
truth:

-   `index.html`
-   `about.html`
-   `contact.html`
-   `design.html`
-   `css/min.css`
-   `parallax.js`
-   `main.js`

All new pages must replicate their structure.

------------------------------------------------------------------------

# 3. NON-NEGOTIABLE RULES

------------------------------------------------------------------------

## A. NAVBAR LOCK

The entire block:

``` html
<div data-collapse="medium" ... class="navbar w-nav">
```

is canonical.

### Do NOT:

-   Change class names
-   Remove `w-nav`, `w-nav-menu`, `w-nav-button`
-   Modify `data-collapse`, `data-animation`, `data-duration`
-   Rename `.frosty-menu`
-   Alter menu structure

Navbar must be copied verbatim.

------------------------------------------------------------------------

## B. FOOTER LOCK

The entire:

``` html
<div class="footer">
```

is canonical.

### Do NOT:

-   Modify `.footer-wrapper`
-   Modify `.footer-content`
-   Modify `.footer-row`
-   Change grid structure
-   Alter social icon layout

Footer must remain identical across pages.

------------------------------------------------------------------------

## C. CSS SYSTEM LOCK

All styling must come from:

    css/min.css

### Strict rules:

-   No new CSS files
-   No inline styles
-   No new font imports
-   No new color hex values
-   No arbitrary spacing values
-   No overriding global styles

Only use: - `.section` - `.container` - `.w-container` -
`.section-heading` - `.heading-m` - `.light` - Existing grid/layout
classes - Existing CSS variables

------------------------------------------------------------------------

## D. BODY LOCK

Every page must use:

``` html
<body class="body">
```

The `.body` class defines: - Background - Typography base - Global
appearance

Never remove or override it.

------------------------------------------------------------------------

## E. SCRIPT ORDER LOCK

Bottom scripts must always remain in this order:

1.  jQuery
2.  Webflow chunk scripts
3.  Webflow main script
4.  Optional libraries (CircleType, etc.)

Never reorder. Never duplicate.

------------------------------------------------------------------------

## F. JAVASCRIPT RULES

Primary JS file:

    main.js

### Do NOT:

-   Create duplicate mobile menu logic
-   Create second smooth scroll handler
-   Add new animation libraries
-   Add second navbar scroll effect
-   Reimplement dropdown behavior

If new behavior is required: - Extend `main.js` - Do not create
conflicting logic

------------------------------------------------------------------------

## G. PARALLAX SYSTEM

`parallax.js` enables:

``` html
<div data-parallax>
```

If parallax is used: - Follow existing pattern - Do not create new
scroll listeners

------------------------------------------------------------------------

## H. CIRCLETYPE SAFETY

Only initialize:

``` js
new CircleType(...)
```

If element exists. Never assume ID exists on all pages.

------------------------------------------------------------------------

# 4. STRUCTURAL TEMPLATE FOR NEW PAGES

All new pages must follow this structure:

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Copy head structure from index.html -->
</head>

<body class="body">

  <!-- NAVBAR (verbatim copy) -->

  <header class="section">
    <div class="container w-container">
      <!-- Page hero -->
    </div>
  </header>

  <div class="section">
    <div class="container">
      <!-- Page content -->
    </div>
  </div>

  <!-- FOOTER (verbatim copy) -->

  <!-- Scripts (same order as home page) -->

</body>
</html>
```

------------------------------------------------------------------------

# 5. DESIGN CONSISTENCY RULES

All new pages must:

-   Use existing spacing rhythm
-   Use existing typography scale
-   Use existing color variables
-   Use existing grid patterns
-   Maintain same navbar behavior
-   Maintain same background
-   Maintain responsive behavior
-   Maintain Webflow class system

------------------------------------------------------------------------

# 6. PROHIBITED ACTIONS

Claude must never:

-   Redesign navbar
-   Redesign footer
-   Introduce new layout system
-   Change container max-width
-   Change background
-   Add new fonts
-   Add Tailwind/Bootstrap
-   Add new CSS framework
-   Add new animation library
-   Modify Webflow-specific attributes
-   Replace `w-nav` system

------------------------------------------------------------------------

# 7. VALIDATION CHECKLIST (MANDATORY BEFORE OUTPUT)

Before returning a new page, confirm:

-   [ ] Navbar is identical to canonical version
-   [ ] Footer is identical to canonical version
-   [ ] Body uses class="body"
-   [ ] No new CSS files created
-   [ ] No inline styles introduced
-   [ ] No new fonts added
-   [ ] Script order preserved
-   [ ] No duplicate JS logic
-   [ ] Only existing classes used
-   [ ] Responsive behavior preserved

------------------------------------------------------------------------

# 8. HOW TO GENERATE NEW PAGES (STANDARD INSTRUCTION)

When creating a new page:

1.  Inspect `index.html`, `about.html`, `contact.html`, `design.html`
2.  Copy navbar and footer verbatim
3.  Copy `<head>` structure and update only:
    -   `<title>`
    -   meta description
4.  Implement only new main content
5.  Keep scripts identical

------------------------------------------------------------------------

# 9. LONG-TERM ARCHITECTURE NOTE

Header and footer are currently duplicated across pages.

Future improvement (optional): - Extract into shared components - Use
static site templating or partial includes

Until then: Header and footer must always be copied exactly.

------------------------------------------------------------------------

# 10. SYSTEM SUMMARY

This portfolio is:

-   Webflow-structured
-   CSS-token-driven
-   JS-light
-   Layout-consistent
-   Fixed design system

The goal of this rule file is to prevent: - Structural drift - Style
inconsistency - JS duplication - Layout breakage

------------------------------------------------------------------------

## END OF SYSTEM FILE
