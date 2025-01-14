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
export function bezierCurveinterpolate(t: number, p: any[]) {
    let order = p.length - 1;
    let d = p[0].length;
    let v = p.map(function (point) {
        return point.slice();
    });
    for (let i = order; i > 0; i--) {
        for (let j = 0; j < order; j++) {
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


export function thirdOrderSpline(t, p) {
    const n = p.length - 1;
    const dt = 1 / n;
    const index = Math.min(Math.max(0, Math.floor(t / dt)), n - 1);
    const u = (t / dt) - index;
    const [p0, p1, p2, p3] = [index > 0 ? p[index - 1] : p[0], p[index], p[Math.min(index + 1, n)], p[Math.min(index + 2, n)]];

    const interpolate = (p0, p1, p2, p3, u) => {
        const u2 = u * u;
        const a0 = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
        const a1 = p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3;
        const a2 = -0.5 * p0 + 0.5 * p2;
        const a3 = p1;
        return a0 * u * u2 + a1 * u2 + a2 * u + a3;
    }
    return [0, 1, 2].map(i => interpolate(p0[i], p1[i], p2[i], p3[i], u));
}


//v[i]*(1-t)+v[i+1]*t