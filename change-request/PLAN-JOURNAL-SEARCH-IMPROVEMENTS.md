# PLAN: Journal Search Page Improvements

## Overview
Three improvements to the journal search page:
1. Apply shadcn/ui components appropriately across all components
2. Fix filter sidebar: fixed on desktop, sheet on mobile
3. Implement pagination with shadcn/ui pagination component

---

## Task 1: Apply shadcn/ui Components

### Current State
Most components already use shadcn/ui, but some use custom implementations.

### Changes Needed

#### 1.1 filter-section.tsx
**Current:** Custom implementation with Button + ChevronDown/Right
**Change to:** Use `Accordion` component from shadcn/ui

**Implementation:**
- Replace custom Button + state management with `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- Use `type="single"` with `collapsible` prop
- Keep Badge for count display
- Maintain same visual styling

#### 1.2 results-cards.tsx
**Current:** Custom div-based card layout
**Change to:** Use `Card`, `CardHeader`, `CardTitle`, `CardContent` from shadcn/ui

**Implementation:**
- Wrap each journal card in `Card` component
- Use `CardHeader` for title section
- Use `CardTitle` for journal title
- Use `CardContent` for publisher, area, badges, ISSN
- Maintain hover effects and cursor pointer

#### 1.3 filter-sidebar.tsx
**Current:** Plain div structure
**Change to:** Use `Card` component for container

**Implementation:**
- Wrap entire sidebar in `Card` component
- Use `CardHeader` for "Filters" title
- Use `CardContent` for filter sections
- Add `CardFooter` for reset button

#### 1.4 Other Components (Already Good)
- search-bar.tsx: Uses `Input` ✓
- filter-checkbox-group.tsx: Uses `Checkbox` and `Label` ✓
- filter-searchable.tsx: Uses `Combobox` ✓
- filter-year-range.tsx: Uses `Input` and `Label` ✓
- active-filters.tsx: Uses `Badge` and `Button` ✓
- sort-controls.tsx: Uses `Select` and `Label` ✓
- view-toggle.tsx: Uses `Button` ✓
- results-table.tsx: Uses `Table` components ✓
- rating-badge.tsx: Uses `Badge` ✓
- pagination-controls.tsx: Uses `Pagination`, `Select`, `Label` ✓
- empty-state.tsx: Uses `Button` ✓

---

## Task 2: Filter Sidebar Responsive Behavior

### Current State
- Desktop: aside with `hidden lg:block` contains FilterSidebar
- Mobile: FilterDrawer wraps FilterSidebar in Sheet
- Sidebar is not sticky on desktop

### Changes Needed

#### 2.1 Desktop (lg+) - Fixed Left Sidebar
**Goal:** Sidebar stays visible when scrolling results

**Implementation:**
```tsx
// In page.tsx
<aside className="hidden lg:block lg:w-[280px] lg:shrink-0">
  <div className="sticky top-4">
    {filterOptions && (
      <FilterSidebar ... />
    )}
  </div>
</aside>
```

**Key changes:**
- Add `sticky top-4` to make sidebar stick when scrolling
- Ensure proper height constraints with `max-h-[calc(100vh-2rem)]`
- Add overflow-y-auto to FilterSidebar content area

#### 2.2 Mobile/Tablet (<lg) - Sheet Drawer
**Current:** Already implemented with FilterDrawer
**Refinement:** Ensure proper behavior

**Implementation:**
- Keep FilterDrawer component as-is
- Ensure it only shows on mobile/tablet (`lg:hidden`)
- Sheet should slide from left (`side="left"`)
- Width should be `w-[300px]` or `w-full` on very small screens

#### 2.3 FilterSidebar Component Updates
**Changes:**
- Add `max-h-[calc(100vh-8rem)]` to container
- Add `overflow-y-auto` to content area
- Ensure proper padding and spacing

---

## Task 3: Pagination with shadcn/ui

### Current State
Already implemented with shadcn/ui pagination components:
- Uses `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, etc.
- Has page size selector (20/50/100)
- Shows "X–Y of Z results"
- Proper page number display with ellipsis

### Changes Needed

#### 3.1 Minor Refinements
**Already good, but verify:**
- Pagination is centered correctly
- Active page has proper styling
- Previous/Next buttons disabled at boundaries
- Page size selector works correctly

#### 3.2 Layout Improvements
**Current:** Flex column on mobile, flex row on larger screens
**Verify:** This matches the design system

**Implementation:**
```tsx
<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
  {/* Page size selector and result count */}
  {/* Pagination controls */}
</div>
```

This is already correct.

#### 3.3 Accessibility
**Verify:**
- Proper aria-labels on pagination nav
- Active page has `aria-current="page"`
- Previous/Next have proper aria-labels

All already implemented in shadcn/ui pagination component.

---

## Execution Order

1. **Task 1.1:** Update filter-section.tsx to use Accordion
2. **Task 1.2:** Update results-cards.tsx to use Card
3. **Task 1.3:** Update filter-sidebar.tsx to use Card
4. **Task 2:** Update page.tsx for sticky sidebar on desktop
5. **Task 3:** Verify pagination (already implemented, just verify)
6. **Test:** Run lint and build to ensure no errors

---

## Files to Modify

1. `src/app/journal-search/components/filter-section.tsx` - Use Accordion
2. `src/app/journal-search/components/results-cards.tsx` - Use Card
3. `src/app/journal-search/components/filter-sidebar.tsx` - Use Card, add sticky support
4. `src/app/journal-search/page.tsx` - Add sticky positioning for sidebar

---

## Testing Checklist

- [ ] Desktop: Sidebar is fixed and sticky when scrolling
- [ ] Mobile: Filter button opens Sheet drawer
- [ ] Tablet: Filter button opens Sheet drawer
- [ ] Filter sections expand/collapse correctly
- [ ] Journal cards use Card component styling
- [ ] Pagination works correctly (next/prev/page numbers)
- [ ] Page size selector works (20/50/100)
- [ ] Active filters display correctly
- [ ] All filters work (checkboxes, comboboxes, year range)
- [ ] Lint passes
- [ ] Build passes
- [ ] No hydration errors
