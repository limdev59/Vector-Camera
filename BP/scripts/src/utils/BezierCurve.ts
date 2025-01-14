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

//(1−t) 3P1 + 3(1−t)2tP2 + 3(1−t)t2P3 + t3P4