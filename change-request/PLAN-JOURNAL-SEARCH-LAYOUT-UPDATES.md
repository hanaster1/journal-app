# Plan: Journal Search Page Layout & Component Updates

## Overview
Four improvements to the journal search page layout and components.

---

## Task 1: Large Screen Layout - 1:5 Ratio

### Current State
- Filter sidebar: fixed `w-[280px]` width
- Results area: `flex-1` (fills remaining space)
- This creates roughly a 1:4 ratio on most screens

### Changes Needed

**File:** `src/app/journal-search/page.tsx`

**Change:**
```tsx
// Current
<aside className="hidden w-[280px] shrink-0 lg:block">

// New
<aside className="hidden w-1/5 shrink-0 lg:block">
```

**Result:**
- Filter takes exactly 20% (1/5) of viewport width on large screens
- Results area takes remaining 80% (4/5)
- More balanced and predictable layout across different screen sizes

---

## Task 2: Results Table - Already Using shadcn/ui Table

### Current State
✅ **Already implemented correctly**

The `results-table.tsx` component already uses:
- `Table` - main wrapper
- `TableHeader` - header section
- `TableBody` - body section
- `TableRow` - individual rows
- `TableHead` - header cells
- `TableCell` - data cells

### Verification
All shadcn/ui Table components are properly imported and used. No changes needed.

---

## Task 3: Sort Controls - Change to Combobox

### Current State
- Uses `Select` component from shadcn/ui
- Simple dropdown with sort options

### Changes Needed

**File:** `src/app/journal-search/components/sort-controls.tsx`

**Replace:**
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`

**With:**
- `Combobox`, `ComboboxInput`, `ComboboxContent`, `ComboboxList`, `ComboboxItem`, `ComboboxEmpty`

**Implementation:**
```tsx
<Combobox value={currentValue} onValueChange={handleChange}>
  <ComboboxInput placeholder="Sort by..." />
  <ComboboxContent>
    <ComboboxList>
      {SORT_OPTIONS.map((option) => (
        <ComboboxItem key={option.value} value={option.value}>
          {option.label}
        </ComboboxItem>
      ))}
    </ComboboxList>
    <ComboboxEmpty>No sort option found</ComboboxEmpty>
  </ComboboxContent>
</Combobox>
```

**Benefits:**
- Consistent with other filter dropdowns (which use Combobox)
- Searchable if needed in future
- Better UX consistency across the page

---

## Task 4: Search Bar - White Background

### Current State
- Uses default `Input` component styling
- Likely has `bg-background` or similar (muted background)

### Changes Needed

**File:** `src/app/journal-search/components/search-bar.tsx`

**Change:**
```tsx
// Current
<Input
  placeholder="Search journals by title, ISSN, publisher..."
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  className="pl-9"
/>

// New
<Input
  placeholder="Search journals by title, ISSN, publisher..."
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  className="pl-9 bg-white"
/>
```

**Result:**
- Search bar has clean white background
- Stands out from the page background
- More prominent and easier to identify

---

## Execution Order

1. **Task 1:** Update page layout to 1:5 ratio
2. **Task 2:** Verify table implementation (no changes needed)
3. **Task 3:** Convert sort controls to use Combobox
4. **Task 4:** Update search bar to white background
5. **Test:** Run lint and build verification

---

## Files to Modify

1. `src/app/journal-search/page.tsx` - Layout ratio change
2. `src/app/journal-search/components/sort-controls.tsx` - Combobox conversion
3. `src/app/journal-search/components/search-bar.tsx` - White background

---

## Testing Checklist

- [ ] Large screen: Filter takes 1/5 width, results take 4/5
- [ ] Medium/small screen: Filter becomes sheet drawer (unchanged)
- [ ] Table displays correctly with all columns
- [ ] Sort combobox opens and selects correctly
- [ ] Sort value updates URL and results
- [ ] Search bar has white background
- [ ] Search functionality still works with debounce
- [ ] Lint passes
- [ ] Build passes
