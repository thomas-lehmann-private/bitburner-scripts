# bitburner-scripts
My bitburner scripts

## Browser

Playing via Browser: https://danielyxie.github.io/bitburner/

## xwalk.js

The module provides the **xwalk** function allowing to walk through
all hosts starting by a given one. The following example demonstrates
the usage; I'm creating server running my scripts name as slave-one,
slave-two, slave-three and so on. The home server and those slaves
cannot be nuked. The list of registered hosts is mainly important
for the walk function but also can be used by your logic.

```javascript
import { xwalk } from "xwalk.js";
import { xnuke } from "xnuke.js";

/** @param {NS} ns **/
export async function main(ns) {
    var registeredHosts = [];
    await xwalk(ns, 'home', registeredHosts, async (strHostName) => {
        if (strHostName !== 'home' && !strHostName.startsWith('slave-')) {
            ns.print("Processing host " + strHostName);
            await xnuke(ns, strHostName);
        }
    }
}
```
## xnuke.js

Usage:

```javascript
import { xnuke } from "xnuke.js";

/** @param {NS} ns **/
export async function main(ns) {
    await xnuke(ns, 'foodnstuff');
}
```

It does call `ns.nuke(strHostName)` but with following conditions:

 - it is called when the host does not have root access.
 - if there is 0 ports required to call it then it is called immediately.
 - if there is 1 port required to call it then `ns.brutessh(strHostName)` is called first (when to tool exists).
 - if there are 2 ports required to call it then `ns.brutessh(strHostName)` and `ns.ftpcrack(strHostName)` is called first (when the tools exist).
 - if there are 3 ports required to call it then `ns.brutessh(strHostName)`, `ns.ftpcrack(strHostName)` and `ns.relaysmtp(strHostName)` is called first (when the tools exist).
 - if there are 4 ports required to call it then `ns.brutessh(strHostName)`, `ns.ftpcrack(strHostName)`, `ns.relaysmtp(strHostName)` and `ns.httpworm(strHostName)` is called first (when the tools exist).

## xhacknet.js

The module provides a function `findIndexForMinimum`. The function to pass takes a hacknet node index
allowing you to search for the node with the smallest value depending on which value you extract from
the hacknet node.

Usage:

```javascript
import { findIndexForMinimum } from "xhacknet.js";

/** @param {NS} ns **/
export async function main(ns) {
    // search for node with lowest level
    var iNode = await findIndexForMinimum(ns, async (iNode) => await ns.hacknet.getNodeStats(iNode).level);
    var upgradeCosts = await ns.hacknet.getLevelUpgradeCost(iNode);
    // can upgrade? (not possible when minimum is already maximum level)
    if (upgradeCosts !== Infinity) {
        // do the upgrade
    }
}
```

See `upgrade-hacknet.js` for complete example.

## upgrade-hacknet.js

The script can be used with `run upgrade-hacknet.js <moneyToKeep>`. 

 1. it is searching for the hacknet node with the smallest node **level** upgrading it when the upgrade costs allow to keep the money specified in the command line parameters (as long as there is an upgrade possible for levels).
 1. it is searching for the hacknet node with the smallest node **RAM** upgrading it when the upgrade costs allow to keep the money specified in the command line parameters (as long as there is an upgrade possible for RAM).
 1. it is searching for the hacknet node with the smallest node **cores** upgrading it when the upgrade costs allow to keep the money specified in the command line parameters (as long as there is an upgrade possible for cores).

 The whole is running inside an endless loop. You have to kill the script when required.


## hack.all.js

The script can be used with `run upgrade-hacknet.js t <threads>`. 

It is running in an endless loop (you have to kill the script when required).
If root access is missing xnuke is called and when succeeded the hacking is following.
As long the hacking level is sufficient and the server has enough money `ns.hack` is called.
If there is not enough money `ns.grow` is called.

## xthreads.js

The script can be used with `run xthreads.js <host> <script>`.

It's calculating the threads you can use to run the script on given server
printing it to the terminal.

## xscp.js

The script can be used with `run xscp.js`.

 - It does copy all .js files from 'home' to all purchased servers.
 - It is assumed that you run the script on 'home'.
 