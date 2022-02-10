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

import { xwalk } from 'xwalk.js'

/**
 * Get all host matching hacking level and having root access
 * sorted descending by most money.
 */
export async function getHosts(ns) {
    var hosts = [];
    var registeredHosts = [];

    await xwalk(ns, 'home', registeredHosts, async (strHostName) => {
        if (strHostName !== 'home' && !strHostName.startsWith('slave')) {
            hosts.push({
                strHostName: strHostName,
                hasRA: await ns.hasRootAccess(strHostName),
                iReqPorts: await ns.getServerNumPortsRequired(strHostName),
                iReqHackingLvl: await ns.getServerRequiredHackingLevel(strHostName),
                fSrvMoneyAvail: Math.trunc(await ns.getServerMoneyAvailable(strHostName)),
                iSrvSecurityLvl: Math.round(await ns.getServerSecurityLevel(strHostName)),
                iHackTime: Math.round(await ns.getHackTime(strHostName)/1000),
                iGrowTime: Math.round(await ns.getGrowTime(strHostName)/1000)
            })
        }
        return true;
    });

    const iHackingLevel = await ns.getHackingLevel()

    hosts = hosts.filter(entry => {
        return entry.iReqHackingLvl < iHackingLevel
            && entry.hasRA
    })

    hosts = hosts.sort((a, b) => {
        if (a.fSrvMoneyAvail < b.fSrvMoneyAvail) {
            return +1
        }
        if (a.fSrvMoneyAvail > b.fSrvMoneyAvail) {
            return -1
        }
        return 0
    })

    return hosts
}