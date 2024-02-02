export function dcubicHermite(p0: any, v0: any, p1: any, v1: any, t: any, f: any) {
    let dh00 = 6 * t * t - 6 * t;
    let dh10 = 3 * t * t - 4 * t + 1;
    let dh01 = -6 * t * t + 6 * t;
    let dh11 = 3 * t * t - 2 * t;
    if (p0.length) {
        if (!f) {
            f = new Array(p0.length);
        }
        for (let i = p0.length - 1; i >= 0; --i) {
            f[i] = dh00 * p0[i] + dh10 * v0[i] + dh01 * p1[i] + dh11 * v1[i];
        }
        return f;
    }
    return dh00 * p0 + dh10 * v0 + dh01 * p1 + dh11 * v1;
}

export function cubicHermite(p0: any, v0: any, p1: any, v1: any, t: any, f: any) {
    let ti = (t - 1), t2 = t * t, ti2 = ti * ti;
    let h00 = (1 + 2 * t) * ti2;
    let h10 = t * ti2;
    let h01 = t2 * (3 - 2 * t);
    let h11 = t2 * ti;
    if (p0.length) {
        if (!f) {
            f = new Array(p0.length);
        }
        for (let i = p0.length - 1; i >= 0; --i) {
            f[i] = h00 * p0[i] + h10 * v0[i] + h01 * p1[i] + h11 * v1[i];
        }
        return f;
    }
    return h00 * p0 + h10 * v0 + h01 * p1 + h11 * v1;
}