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
import { xwalk } from "xwalk.js";
import { xnuke } from "xnuke.js";

/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        var registeredHosts = [];
        await xwalk(ns, 'home', registeredHosts, async (strHostName) => {
            if (strHostName !== 'home' && !strHostName.startsWith('slave')) {
                ns.print("Processing host " + strHostName);
                var hasRootAccess = await xnuke(ns, strHostName);
                if (hasRootAccess) {
                    if (await ns.getHackingLevel() > ns.getServerRequiredHackingLevel(strHostName)) {
                        while (ns.getServerSecurityLevel(strHostName) >= 50) {
                            await ns.weaken(strHostName);
                        }
                    }
                }
            }
            // continue the walking
            return true;
        });
    }
}
