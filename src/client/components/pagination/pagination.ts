/**
 *
 * @param currentPage The current page.
 * @param lastPage The last page.
 * @param path The path used to set the href on the anchor elements.
 * @param matcher The text to replace in the path with the generated page number.
 * @param boundaryCount The number of buttons at the edges.
 * @param sibilingCount The number of buttons around the current page.
 * @returns The pagination component as a template literal string.
 */
export default function pagination(
  currentPage: number,
  lastPage: number,
  path: string,
  matcher: string,
  boundaryCount: number = 1,
  sibilingCount: number = 1
): string {
  const pages = buildPaginationData(
    currentPage,
    lastPage,
    boundaryCount,
    sibilingCount,
    true,
    '...'
  );

  return `
  <div class="pagination">
    <ul class="pagination__list">
      ${pages
        .map((element) => {
          return `
        <li>
          ${linkBuilder(element, path, matcher, currentPage)}
        </li>`;
        })
        .join('')}
    </ul>
  </div>
  `;
}
//|---------leftSide----------|    |--------------center-------------|     |------rightSide-----------|
//<firstPage,...boundaryCount>,...,<...sibling>currentPage<...sibling>,...,<...boundaryCount,lastPage>
function buildPaginationData(
  currentPage: number,
  lastPage: number,
  boundaryCount: number,
  siblingCount: number,
  showPrevNext: boolean = true,
  pageBreak: string = '...'
): Array<string | number> {
  let sibStart: number;
  let sibEnd: number;

  const leftSide: Array<number> = [];
  const rightSide: Array<number> = [];
  const center: Array<number> = [];

  leftSide.push(...rangeGenerator(1, Math.min(lastPage, boundaryCount)));
  rightSide.push(
    ...rangeGenerator(
      Math.max(boundaryCount + 1, lastPage + 1 - boundaryCount),
      lastPage
    )
  );

  //determine if the siblings should start at the expected point or does that start point
  //need to be readjusted
  sibStart = Math.max(
    boundaryCount + 2,

    //readjusts
    Math.min(
      currentPage - siblingCount,
      lastPage - boundaryCount - siblingCount * 2 - 1
    )
  );

  sibEnd = Math.min(
    lastPage + 1 - boundaryCount - 2,
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2)
  );

  center.push(...rangeGenerator(sibStart, sibEnd));

  return [
    ...(showPrevNext && currentPage > 1 ? ['prev'] : []),
    ...leftSide,

    ...(sibStart > boundaryCount + 2
      ? [pageBreak]
      : //if the missing number should be added when the ellipsis was omitted
      lastPage - boundaryCount > boundaryCount + 1
      ? [boundaryCount + 1]
      : []),

    ...center,

    ...(sibEnd < lastPage - boundaryCount - 1
      ? [pageBreak]
      : lastPage - boundaryCount > boundaryCount
      ? [lastPage - boundaryCount]
      : []),

    ...rightSide,
    ...(showPrevNext && currentPage < lastPage ? ['next'] : []),
  ];
}

function rangeGenerator(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (e, i) => i + start);
}

function linkBuilder(
  value: string | number,
  path: string,
  matcher: string,
  currentPage: number
): string {
  const pageNum = Number(value);

  if (pageNum) {
    const isCurrentPage = pageNum === currentPage;

    return `<a href=${path.replace(matcher, 'page=' + pageNum)} 
    ${isCurrentPage ? 'class= "active-page"' : ''}
    aria-label="Page ${
      isCurrentPage ? pageNum + '. Current.' : pageNum
    }" data-link>${value}</a>`;
  }

  if (value === 'next') {
    return `<a href=${path.replace(
      matcher,
      'page=' + (currentPage + 1)
    )} aria-label="Next Page." data-link>${value}</a>`;
  }

  if (value === 'prev') {
    return `<a href=${path.replace(
      matcher,
      'page=' + (currentPage - 1)
    )} aria-label="Prev Page." data-link>${value}</a>`;
  }

  return `<a>${value}</a>`;
}
