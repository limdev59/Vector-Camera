export function firstOrderSpline(t: number, p: any[]) {
    let order = p.length - 1;
    let d = p[0].length;
    let v = p.map(function (point) {
        return point.slice();
    });
    for (let i = order; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            for (let k = 0; k < d; k++) {
                v[j][k] = (1 - t) * v[j][k] + t * v[j + 1][k];
            }
        }
    }

    return v[0];
}

export function linearSpline(t, p) {
    const order = p.length - 1;
    const d = p[0].length;
    let v = p.map(function (point) {
        return point.slice();
    });

    const segLen = 1 / order;
    const segIdx = Math.floor(t / segLen);
    const tNorm = (t - segIdx * segLen) / segLen;


    const interpPt = [];

    for (let i = 0; i < d; i++) {
        const ptA = v[segIdx][i];
        const ptB = v[segIdx + 1][i];
        const interpVal = ptA * (1 - tNorm) + ptB * tNorm;
        interpPt.push(interpVal);
    }

    return interpPt;
}

//v[i]*(1-t)+v[i+1]*t
