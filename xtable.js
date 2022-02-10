/*
 * The MIT License
 *
 * Copyright 2022 Thomas Lehmann.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Printing a list of objects as table.
 *
 * @param {NS} ns API for Bitburner
 * @param {array} arrayOfData 
 */
export function printTable(ns, arrayOfData) {
    if (arrayOfData.length > 0) {
        const keys = Object.keys(arrayOfData[0])
        const widths = new Array(keys.length).fill(0)

        // include table headers in width calculation
        for (let iKey = 0; iKey < keys.length; ++iKey) {
            if (keys[iKey].length > widths[iKey]) {
                widths[iKey] = keys[iKey].length
            }
        }

        // find out max widths for data columns
        arrayOfData.forEach(entry => {
            for (let iKey = 0; iKey < keys.length; ++iKey) {
                const strValue = String(entry[keys[iKey]])
                if (strValue.length > widths[iKey]) {
                    widths[iKey] = strValue.length
                }
            }
        })

        // print column header
        let strRow = ' | '
        for (let iKey = 0; iKey < keys.length; ++iKey) {
            strRow += keys[iKey].padEnd(widths[iKey]) + ' | '
        }
        ns.tprint(strRow)

        // print separator line between headers and data
        strRow = ' | '
        for (let iKey = 0; iKey < keys.length; ++iKey) {
            strRow += '-'.repeat(widths[iKey]) + ' | '
        }
        ns.tprint(strRow)

        // print data
        arrayOfData.forEach(entry => {
            let strRow = ' | '
            for (let iKey = 0; iKey < keys.length; ++iKey) {
                const strValue = String(entry[keys[iKey]])
                if (typeof entry[keys[iKey]] === 'number') {
                    strRow += strValue.padStart(widths[iKey]) + ' | '
                } else {
                    strRow += strValue.padEnd(widths[iKey]) + ' | '
                }
            }
            ns.tprint(strRow)
        })
    }
}
