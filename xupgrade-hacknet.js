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
import { findIndexForMinimum } from "xhacknet.js";

/** @param {NS} ns **/
export async function main(ns) {
    var SLEEP_STEP = 1000; // 1 second
    var SLEEP_NO_MONEY = 60 * 1000; // 1 minute
    var SLEEP_NO_UPGRADE = 5 * 60 * 1000; // 5 minutes

    var playerMinimumMoney = parseInt(ns.args[0], 10);

    // run forever (that's the plan) -> kill it, if required
    while (true) {
        var player = await ns.getPlayer();
        // search for node with lowest level
        var iNode = await findIndexForMinimum(ns, async (iNode) => await ns.hacknet.getNodeStats(iNode).level);
        var upgradeCosts = await ns.hacknet.getLevelUpgradeCost(iNode);
        // can upgrade? (not possible when minimum is already maximum level)
        if (upgradeCosts !== Infinity) {
            if ((player.money - upgradeCosts) < playerMinimumMoney) {
                ns.print("Not enough money (given: " + player.money + ", keep: " + playerMinimumMoney);
                await ns.sleep(SLEEP_NO_MONEY);
            } else {
                await ns.hacknet.upgradeLevel(iNode);
                await ns.sleep(SLEEP_STEP);
            }
            continue;
        }

        player = await ns.getPlayer();
        // search for node with lowest ram
        iNode = await findIndexForMinimum(ns, async (iNode) => await ns.hacknet.getNodeStats(iNode).ram);
        upgradeCosts = await ns.hacknet.getRamUpgradeCost(iNode);
        // can upgrade? (not possible when minimum is already maximum ram)
        if (upgradeCosts !== Infinity) {
            if ((player.money - upgradeCosts) < playerMinimumMoney) {
                ns.print("Not enough money (given: " + player.money + ", keep: " + playerMinimumMoney);
                await ns.sleep(SLEEP_NO_MONEY);
            } else {
                await ns.hacknet.upgradeRam(iNode);
                await ns.sleep(SLEEP_STEP);
            }
            continue;
        }

        player = await ns.getPlayer();
        // search for node with lowest cores
        iNode = await findIndexForMinimum(ns, async (iNode) => await ns.hacknet.getNodeStats(iNode).cores);
        upgradeCosts = await ns.hacknet.getCoreUpgradeCost(iNode);
        // can upgrade? (not possible when minimum is already maximum cores)
        if (upgradeCosts !== Infinity) {
            if ((player.money - upgradeCosts) < playerMinimumMoney) {
                ns.print("Not enough money (given: " + player.money + ", keep: " + playerMinimumMoney);
                await ns.sleep(SLEEP_NO_MONEY);
            } else {
                await ns.hacknet.upgradeCore(iNode);
                await ns.sleep(SLEEP_STEP);
            }
            continue;
        }

        player = await ns.getPlayer();
        var nodeCosts = ns.hacknet.getPurchaseNodeCost();
        // can purchase?
        if (nodeCosts !== Infinity) {
            if ((player.money - nodeCosts) < playerMinimumMoney) {
                ns.print("Not enough money (given: " + player.money + ", keep: " + playerMinimumMoney);
                await ns.sleep(SLEEP_NO_MONEY);
            } else {
                ns.hacknet.purchaseNode();
                await ns.sleep(SLEEP_STEP);
            }
        }

        // sleeping longer because nothing to upgrade
        await ns.sleep(SLEEP_NO_UPGRADE);
    }
}
