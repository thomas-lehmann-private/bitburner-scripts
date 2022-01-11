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

/** @param {NS} ns **/
export async function main(ns) {
    // at the moment we have to pass the server name because the api with that function
    // requires a special capability I can't use yet.
    const strCurrentHost = ns.args[0];
    // the name of the script
    const strScriptName = ns.args[1];

    const fRamCost = await ns.getScriptRam(strScriptName);
    const fRamMax = await ns.getServerMaxRam(strCurrentHost);
    const fRamUsed = await ns.getServerUsedRam(strCurrentHost);

    // calculate the number of threads you can use
    const iThreads = Math.trunc((fRamMax - fRamUsed) / fRamCost);

    ns.tprint("Memory free on the server is " + (fRamMax - fRamUsed) + " GB");
    ns.tprint("Script " + strScriptName + " requires " + fRamCost + " GB.");

    if (iThreads === 0) {
        ns.tprint("Not enough memory available to run the script on this server.");
    } else {
        ns.tprint("You can run it with " + iThreads + " threads on this server.");
    }
}
