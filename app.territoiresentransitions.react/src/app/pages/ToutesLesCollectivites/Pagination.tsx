import {useEffect, useState} from 'react';

export type TPaginationProps = {
  selectedPage: number;
  nbOfPages: number;
  onChange: (selectedPage: number) => void;
};

/**
 * Permet de changer de page
 */
export const Pagination = (props: TPaginationProps) => {
  const [selectedPage, setSelectedPage] = useState<number>(props.selectedPage);
  const [leftPageRangeToDisplay, setLeftPageRangeToDisplay] = useState<
    number[]
  >([]);
  const [rightPageRangeToDisplay, setRightPageRangeToDisplay] = useState<
    number[]
  >([]);

  const setSelectedPageAndScrollToTop = (page: number) => {
    setSelectedPage(page);
    window.scrollTo(0, 0);
  };
  const setPageRangesToDisplay = () => {
    if (props.nbOfPages <= 6) {
      setLeftPageRangeToDisplay(range(1, props.nbOfPages));
      setRightPageRangeToDisplay([]);
    } else if (selectedPage <= props.nbOfPages - 3) {
      setLeftPageRangeToDisplay(
        range(Math.max(1, selectedPage - 3), Math.max(selectedPage, 4))
      );
      setRightPageRangeToDisplay([props.nbOfPages]);
    } else {
      setLeftPageRangeToDisplay(range(1, 4 - (props.nbOfPages - selectedPage)));
      setRightPageRangeToDisplay(
        range(Math.max(selectedPage, 4), props.nbOfPages)
      );
    }
  };

  useEffect(() => {
    setPageRangesToDisplay();
    props.onChange(selectedPage);
  }, [selectedPage, props.nbOfPages]);
  return (
    <nav role="navigation" className="fr-pagination" aria-label="Pagination">
      <ul className="fr-pagination__list">
        <button
          className="fr-pagination__link fr-pagination__link--first"
          aria-disabled="true"
          role="link"
          onClick={() => setSelectedPageAndScrollToTop(1)}
          disabled={selectedPage === 1}
        >
          Première page
        </button>

        <button
          className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
          aria-disabled="true"
          role="link"
          onClick={() => setSelectedPageAndScrollToTop(selectedPage - 1)}
          disabled={selectedPage === 1}
        >
          Page précédente
        </button>
        {leftPageRangeToDisplay.map(page => (
          <PageSelector
            key={page}
            number={page}
            isSelected={selectedPage === page}
            onClick={() => setSelectedPageAndScrollToTop(page)}
          />
        ))}

        <div className={props.nbOfPages <= 6 ? 'hidden' : ''}>
          <button disabled className="fr-pagination__link fr-displayed-lg">
            …
          </button>
        </div>

        {rightPageRangeToDisplay.map(page => (
          <PageSelector
            key={page}
            number={page}
            isSelected={selectedPage === page}
            onClick={() => setSelectedPageAndScrollToTop(page)}
          />
        ))}
        <button
          className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
          onClick={() => setSelectedPageAndScrollToTop(selectedPage + 1)}
          disabled={selectedPage === props.nbOfPages}
        >
          Page suivante
        </button>
        <button
          className="fr-pagination__link fr-pagination__link--last"
          onClick={() => setSelectedPageAndScrollToTop(props.nbOfPages)}
          disabled={selectedPage === props.nbOfPages}
        >
          Dernière page
        </button>
      </ul>
    </nav>
  );
};

export const PageSelector = (props: {
  number: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  if (props.isSelected)
    return (
      <button
        className="fr-pagination__link"
        aria-current="page"
        title={`Page ${props}`}
      >
        {props.number}
      </button>
    );
  return (
    <button
      className="fr-pagination__link"
      title={`Page ${props}`}
      onClick={props.onClick}
    >
      {props.number}
    </button>
  );
};

const range = (start: number, end: number) =>
  Array.from({length: end - start + 1}, (v, k) => start + k);