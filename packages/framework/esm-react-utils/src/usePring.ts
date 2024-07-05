import { useReactToPrint } from 'react-to-print';
import { type MutableRefObject, useCallback } from 'react';

export interface PrintEventHandlers {
  onAfterPrint?: () => void;
  onBeforeGetContent?: () => void | Promise<any>;
  onBeforePrint?: () => void | Promise<any>;
  onPrintError?: (errorLocation: 'onBeforeGetContent' | 'onBeforePrint' | 'print', error: Error) => void;
}

/**
 * A custom hook for printing a specified HTML element using the `react-to-print` library.
 * This hook provides event handlers to manage various stages of the printing process.
 *
 * @param ref - A reference to the HTML element you want to print.
 * @param pageSize - Specifies the size of the printed page. Defaults to "A4" if not provided.
 * @param handlers - An object containing optional event handlers for different stages of the print process.
 *
 * @example
 * ```ts
 * import React, { useRef } from "react";
 * import usePrint, { PrintEventHandlers } from "./usePrint";
 *
 * const PrintComponent: React.FC = () => {
 *   const printRef = useRef<HTMLDivElement | null>(null);
 *
 *   const handlers: PrintEventHandlers = {
 *     onAfterPrint: () => console.log("Print completed"),
 *     onBeforeGetContent: () => console.log("Getting content"),
 *     onBeforePrint: () => console.log("Before print"),
 *     onPrintError: (location, error) => console.error(`Error in ${location}:`, error),
 *   };
 *
 *   const handlePrint = usePrint(printRef, "A4", handlers);
 *
 *   return (
 *     <div>
 *       <div ref={printRef}>
 *         <h1>Print this content</h1>
 *         <p>This is the content that will be printed.</p>
 *       </div>
 *       <button onClick={handlePrint}>Print</button>
 *     </div>
 *   );
 * };
 *
 * export default PrintComponent;
 * ```
 */
const usePrint = (
  ref: MutableRefObject<HTMLElement | null>,
  pageSize: String = '',
  handlers: PrintEventHandlers = {},
): (() => void) => {
  const { onAfterPrint, onBeforePrint, onBeforeGetContent, onPrintError } = handlers;

  const getContent: () => HTMLElement | null = useCallback<() => HTMLElement | null>(() => {
    return ref.current;
  }, [ref]);

  const reactPrint = (target: HTMLIFrameElement) => {
    target.contentWindow?.print();
    return Promise.resolve(true);
  };

  return useReactToPrint({
    print: typeof window !== 'undefined' ? reactPrint : undefined,
    content: getContent,
    copyStyles: true,
    removeAfterPrint: false,
    onAfterPrint,
    onBeforePrint,
    onBeforeGetContent,
    onPrintError,
    pageStyle: `
      @page {
        size: ${pageSize === '' ? 'A4' : pageSize};
      }
    `,
  });
};

export default usePrint;
