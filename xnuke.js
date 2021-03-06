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
 * Get map with tools given state and the api call for it.
 *
 * @param {NS} ns api instance for Bitburner
 * @returns {Object} map with tools
 */
async function getTools(ns) {
    return {
        brutessh: {
            given: await ns.fileExists('BruteSSH.exe', 'home'),
            openPort: ns.brutessh
        },
        ftpcrack: {
            given: await ns.fileExists('FTPCrack.exe', 'home'),
            openPort: ns.ftpcrack
        },
        relaysmtp: {
            given: await ns.fileExists('relaySMTP.exe', 'home'),
            openPort: ns.relaysmtp
        },
        httpworm: {
            given: await ns.fileExists('HTTPWorm.exe', 'home'),
            openPort: ns.httpworm
        },
        sqlinject: {
            given: await ns.fileExists('SQLInject.exe', 'home'),
            openPort: ns.sqlinject
        }
    }
}

/**
 * Get number of available tools.
 */
 export async function givenTools(ns) {
    const tools = await getTools(ns)
    return [tools.brutessh.given, tools.ftpcrack.given, tools.relaysmtp,
            tools.httpworm.given, tools.sqlinject.given].filter(entry => entry === true).length
}

/**
 * Run nuke with opening of required ports (when possible).
 * It's not running when root access is already given.
 *
 * @param {NS} ns api instance of Bitburner
 * @param {String} strHostName name of host
 * @return {Boolean} true when root access has been established.
 */
export async function xnuke(ns, strHostName) {
    var hasRootAccess = await ns.hasRootAccess(strHostName)

    // Missing root access? Trying to get it ...
    if (!hasRootAccess) {
        const tools = await getTools(ns)
        const iNumRequiredPort = ns.getServerNumPortsRequired(strHostName)

        switch (iNumRequiredPort) {
            case 0:
                await ns.nuke(strHostName)
                hasRootAccess = true
                break

            case 1:
                if (tools.brutessh.given) {
                    await tools.brutessh.openPort(strHostName)
                    await ns.nuke(strHostName)
                    hasRootAccess = true
                }
                break

            case 2:
                if (tools.brutessh.given && tools.ftpcrack.given) {
                    await tools.brutessh.openPort(strHostName)
                    await tools.ftpcrack.openPort(strHostName)
                    await ns.nuke(strHostName)
                    hasRootAccess = true
                }
                break

            case 3:
                if (tools.brutessh.given && tools.ftpcrack.given && tools.relaysmtp.given) {
                    await tools.brutessh.openPort(strHostName)
                    await tools.ftpcrack.openPort(strHostName)
                    await tools.relaysmtp.openPort(strHostName)
                    await ns.nuke(strHostName)
                    hasRootAccess = true
                }
                break

            case 4:
                if (tools.brutessh.given && tools.ftpcrack.given && tools.relaysmtp.given && tools.httpworm.given) {
                    await tools.brutessh.openPort(strHostName)
                    await tools.ftpcrack.openPort(strHostName)
                    await tools.relaysmtp.openPort(strHostName)
                    await tools.httpworm.openPort(strHostName)
                    await ns.nuke(strHostName);
                    hasRootAccess = true
                }
                break

            case 5:
                if (tools.brutessh.given && tools.ftpcrack.given && tools.relaysmtp.given && tools.httpworm.given && tools.sqlinject) {
                    await tools.brutessh.openPort(strHostName)
                    await tools.ftpcrack.openPort(strHostName)
                    await tools.relaysmtp.openPort(strHostName)
                    await tools.httpworm.openPort(strHostName)
                    await tools.sqlinject.openPort(strHostName)
                    await ns.nuke(strHostName)
                    hasRootAccess = true
                }
                break
            }
    }

    return hasRootAccess;
}
