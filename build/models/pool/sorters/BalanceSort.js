"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceSort = void 0;
class BalanceSort {
    static sort(endpoints) {
        return endpoints.sort(this.balance);
    }
    static balance(e1, e2) {
        const { stats: { lastSent: lastSent1, messageSentCounter: totalMessages1, respAverageTime: respAverageTime1 }, } = e1;
        const { stats: { lastSent: lastSent2, messageSentCounter: totalMessages2, respAverageTime: respAverageTime2 }, } = e2;
        // Comparamos primero por el campo timestamp (valor mas chico primero (ASC))
        if (lastSent1 && lastSent2 && lastSent1.getTime() < lastSent2.getTime())
            return -1;
        else if (lastSent1 && lastSent2 && lastSent1.getTime() > lastSent2.getTime())
            return 1;
        else {
            // Si el valor de timestamp es igual uno al otro, comparamos ahora por el campo cantidad de envios (el de menor valor va primero)
            if (totalMessages1 < totalMessages2)
                return -1;
            else if (totalMessages1 > totalMessages2)
                return 1;
            else {
                //Si el valor de la cantidad de envios es la misma, comparamos ahora por el promedio de tiempo de envio (el menor valor va primero)
                if (respAverageTime1 < respAverageTime2)
                    return -1;
                else if (respAverageTime1 > respAverageTime2)
                    return 1;
                else
                    return 0;
            }
        }
    }
}
exports.BalanceSort = BalanceSort;
