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
 * Walking (iterating) through all hosts.
 *
 * @param {NS} ns api instance of Bitburner
 * @param {String} strHostName name of host
 * @param {Array} registeredHosts list of already visited hosts
 * @param {Function} callback function that can do anything with currently found host
 * @return true for continuing the walking, otherwise false.
 */
export async function xwalk(ns, strHostName, registeredHosts, callback) {
    // remember already visited hosts
    registeredHosts.push(strHostName);
    // doing 'something' for the concrete host
    if (!await callback(strHostName)) {
        return false;
    }

    var hosts = await ns.scan(strHostName);
    // for all hosts being one node away from given host
    for (var iHost = 0; iHost < hosts.length; ++iHost) {
        var foundIndex = registeredHosts.indexOf(hosts[iHost]);
        // we continue only when the host has not been visted yet
        if (foundIndex < 0) {
            if (!await xwalk(ns, hosts[iHost], registeredHosts, callback)) {
                return false;
            }
        }
    }

    return true;
}
