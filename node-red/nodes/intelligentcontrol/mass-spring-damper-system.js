// Function that defines the differential equations
function massSpringDamperSystem(t, y) {
    const n = y.length / 2; // Number of masses (half the size of the y array)
    const m = []; // Array to store the masses
    const k = []; // Array to store the spring constants
    const c = []; // Array to store the damping coefficients

    // Set the values of masses, spring constants, and damping coefficients
    for (let i = 0; i < n; i++) {
        m[i] = 1; // Mass of mass i
        k[i] = 1; // Spring constant between mass i and mass i-1
        c[i] = 0.1; // Damping coefficient between mass i and mass i-1
    }

    const dydt = new Array(2 * n); // Array to store the derivatives of y

    // Differential equations for each mass
    for (let i = 0; i < n; i++) {
        // i*2 represents the position of mass i
        // i*2+1 represents the velocity of mass i
        dydt[i * 2] = y[i * 2 + 1]; // dx_i/dt = v_i
        dydt[i * 2 + 1] = 0; // Initially, dv_i/dt = 0

        // Terms related to the spring and damper between mass i and mass i-1
        if (i > 0) {
            dydt[i * 2] += (-k[i] * (y[i * 2] - y[i * 2 - 2]) - c[i] * (y[i * 2 + 1] - y[i * 2 - 1])) / m[i];
            dydt[i * 2 + 1] += (k[i] * (y[i * 2] - y[i * 2 - 2]) + c[i] * (y[i * 2 + 1] - y[i * 2 - 1])) / m[i];
        }

        // Terms related to the spring and damper between mass i and mass i+1
        if (i < n - 1) {
            dydt[i * 2] += (-k[i + 1] * (y[i * 2] - y[i * 2 + 2]) - c[i + 1] * (y[i * 2 + 1] - y[i * 2 + 3])) / m[i];
            dydt[i * 2 + 1] += (k[i + 1] * (y[i * 2] - y[i * 2 + 2]) + c[i + 1] * (y[i * 2 + 1] - y[i * 2 + 3])) / m[i];
        }
    }

    return dydt;
}

// Function to solve the system using the Euler's method
function eulerSolver() {
    const n = 5; // Number of masses
    const h = 0.01; // Integration step size
    const t0 = 0; // Initial time
    const tFinal = 10; // Final time

    let t = t0;
    let y = new Array(2 * n); // Array to store positions and velocities [x1, v1, x2, v2, ...]

    // Set initial conditions
    for (let i = 0; i < n; i++) {
        y[i * 2] = 1; // Initial position of mass i
        y[i * 2 + 1] = 1; // Initial velocity of mass i
    }

    while (t <= tFinal) {
        // Print the results
        console.log(`t = ${t.toFixed(2)}, x = [${y.slice(0, 2 * n).map((value) => value.toFixed(2)).join(', ')}]`);

        // Calculate the derivatives using the differential equations
        const dydt = massSpringDamperSystem(t, y);

        // Update the positions and velocities using the Euler's method
        for (let i = 0; i < 2 * n; i++) {
            y[i] += h * dydt[i];
        }

        t += h; // Increment the time step
    }
}

eulerSolver();

