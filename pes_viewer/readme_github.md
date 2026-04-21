# PES Web Viewer Dataset Format (Schema v5)

This document is the **single reference** for preparing a JSON dataset that can be loaded by the PES web viewer.

The viewer expects a **2D reduced-coordinate dataset** with active reduced coordinates

```math
q_1, q_2.
```

The full Cartesian molecular geometry still appears in the file, but only as a displayed geometry field sampled over the reduced 2D grid.

---

## 1. What the dataset represents

A dataset contains

- a rectangular grid in the two reduced coordinates $(q_1,q_2)$,
- a scalar potential-energy surface ``$\mathbf{E}(q_1,q_2)$``,
- first and second derivatives of that reduced PES,
- a reduced mass-weighted Hessian,
- the displayed Cartesian geometry $R(q_1,q_2)$,
- and the Jacobian of that geometry with respect to $q_1$ and $q_2$.

So the mathematical object is

```math
(q_1,q_2) \mapsto [E, \nabla E, H, H_{\mathrm{mw}}, R, J].
```

All stored numerical values use **atomic units**.

---

## 2. Important point about array order

All grid-dependent arrays are stored with the first two indices ordered as

```text
[q2_index, q1_index, ...]
```

This is the required file format.

Here:

- `q2_index` means the index into `grid.q2_values`
- `q1_index` means the index into `grid.q1_values`
- `...` means any additional **component axes** that may follow the two grid axes

Examples:

- for a scalar field such as energy, there are no more axes after `[q2_index, q1_index]`
- for a vector field such as the gradient, there is one more component axis
- for a matrix field such as the Hessian, there are two more component axes
- for Cartesian geometry fields, atom and Cartesian-component axes follow the two grid axes

---

## 3. Required top-level JSON keys

Your JSON object must contain these top-level keys:

```text
schema_version
model_key
storage_unit_family
display_unit_families_supported
units
presentation
coordinate_definition
grid
atoms
fields
```

---

## 4. Required stored units

Use these exact stored units:

```json
{
  "q1": "bohr",
  "q2": "bohr",
  "energy": "hartree",
  "gradient": "hartree/bohr",
  "hessian": "hartree/bohr^2",
  "mw_hessian": "hartree/(electron_mass*bohr^2)",
  "geometry": "bohr",
  "geometry_jacobian": "bohr/bohr"
}
```

The generator also writes a `reference_conversion` block under `units`, containing conversion constants such as Hartree to eV and Bohr to Å.

---

## 5. Mathematical meaning of each field

Let the two reduced coordinates be collected as

```math
q = (q_1,q_2).
```

Let the displayed Cartesian geometry of atom $a$ be

```math
R_a(q_1,q_2) =
\begin{pmatrix}
R_{a,x}(q_1,q_2) \\
R_{a,y}(q_1,q_2) \\
R_{a,z}(q_1,q_2)
\end{pmatrix}.
```

### 5.1 Energy

The scalar PES is

```math
E(q_1,q_2).
```

Stored as:

```text
fields.energy_hartree[q2_index, q1_index]
```

Shape:

```text
[nq2, nq1]
```

---

### 5.2 Gradient

The reduced gradient is

```math
\nabla E(q_1,q_2) =
\begin{pmatrix}
\dfrac{\partial E}{\partial q_1} \\
\dfrac{\partial E}{\partial q_2}
\end{pmatrix}.
```

Stored as:

```text
fields.gradient_hartree_per_bohr[q2_index, q1_index, alpha]
```

with component convention

- `alpha = 0` means $\partial E / \partial q_1$
- `alpha = 1` means $\partial E / \partial q_2$

Shape:

```text
[nq2, nq1, 2]
```

---

### 5.3 Ordinary reduced Hessian

The reduced Hessian is

```math
H_{\alpha\beta}(q_1,q_2)
= \frac{\partial^2 E}{\partial q_\alpha \, \partial q_\beta},
\qquad \alpha,\beta \in \{1,2\}.
```

Explicitly,

```math
H(q_1,q_2) =
\begin{pmatrix}
\dfrac{\partial^2 E}{\partial q_1^2} & \dfrac{\partial^2 E}{\partial q_1\partial q_2} \\
\dfrac{\partial^2 E}{\partial q_2\partial q_1} & \dfrac{\partial^2 E}{\partial q_2^2}
\end{pmatrix}.
```

Stored as:

```text
fields.hessian_hartree_per_bohr2[q2_index, q1_index, alpha, beta]
```

Shape:

```text
[nq2, nq1, 2, 2]
```

This matrix should be symmetric:

```math
H_{12} = H_{21}.
```

---

### 5.4 Mass-weighted reduced Hessian

Let the reduced-coordinate mass matrix be

```math
M =
\begin{pmatrix}
M_{11} & M_{12} \\
M_{21} & M_{22}
\end{pmatrix}.
```

The stored mass-weighted Hessian is

```math
H_{\mathrm{mw}} = M^{-1/2} H M^{-1/2}.
```

Stored as:

```text
fields.mw_hessian_hartree_per_electron_mass_bohr2[q2_index, q1_index, alpha, beta]
```

Shape:

```text
[nq2, nq1, 2, 2]
```

This is the local matrix that is diagonalized to obtain reduced normal-mode directions and local angular frequencies in the reduced space.

---

### 5.5 Displayed Cartesian geometry

The displayed geometry is

```math
R(q_1,q_2) = \{ R_a(q_1,q_2) \}_{a=1}^{N_{\mathrm{atoms}}}.
```

For each atom $a$, each geometry is a 3-vector

```math
R_a = (R_{a,x}, R_{a,y}, R_{a,z}).
```

Stored as:

```text
fields.geometries_bohr[q2_index, q1_index, atom_index, xyz]
```

with Cartesian convention

- `xyz = 0` means $x$
- `xyz = 1` means $y$
- `xyz = 2` means $z$

Shape:

```text
[nq2, nq1, natoms, 3]
```

So the molecule still lives in full Cartesian space, but it is parameterized by only two reduced coordinates $(q_1,q_2)$.

---

### 5.6 Geometry Jacobian

The geometry Jacobian tells the viewer how the displayed Cartesian geometry changes when the reduced coordinates change.

Define

```math
J_{\alpha,a,c}(q_1,q_2)
= \frac{\partial R_{a,c}}{\partial q_\alpha},
```

where

- $\alpha \in \{1,2\}$ labels the reduced coordinate
- $a$ labels the atom
- $c \in \{x,y,z\}$ labels the Cartesian component

Stored as:

```text
fields.geometry_jacobian_bohr_per_bohr[q2_index, q1_index, reduced_coordinate_index, atom_index, xyz]
```

with convention

- `reduced_coordinate_index = 0` means $\partial R / \partial q_1$
- `reduced_coordinate_index = 1` means $\partial R / \partial q_2$

Shape:

```text
[nq2, nq1, 2, natoms, 3]
```

This object is important because it lets the viewer reconstruct a Cartesian displacement pattern from a reduced-space mode vector

```math
u = (u_1,u_2)
```

through

```math
\Delta R_a
= \frac{\partial R_a}{\partial q_1} u_1
+ \frac{\partial R_a}{\partial q_2} u_2.
```

---

## 6. Required shapes

Let

- `nq1 = len(grid.q1_values)`
- `nq2 = len(grid.q2_values)`
- `natoms = len(atoms.symbols)`

Then the required shapes are exactly:

```text
grid.shape                                         = [nq2, nq1]
fields.energy_hartree                              = [nq2, nq1]
fields.gradient_hartree_per_bohr                   = [nq2, nq1, 2]
fields.hessian_hartree_per_bohr2                   = [nq2, nq1, 2, 2]
fields.mw_hessian_hartree_per_electron_mass_bohr2  = [nq2, nq1, 2, 2]
fields.geometries_bohr                             = [nq2, nq1, natoms, 3]
fields.geometry_jacobian_bohr_per_bohr             = [nq2, nq1, 2, natoms, 3]
```

---

## 7. Exact JSON skeleton

Your file should look like this structurally:

```json
{
  "schema_version": 5,
  "model_key": "your_model_name",
  "storage_unit_family": "atomic_units",
  "display_unit_families_supported": [
    "atomic_units",
    "chemistry_units",
    "thermochemistry_units"
  ],
  "units": {
    "q1": "bohr",
    "q2": "bohr",
    "energy": "hartree",
    "gradient": "hartree/bohr",
    "hessian": "hartree/bohr^2",
    "mw_hessian": "hartree/(electron_mass*bohr^2)",
    "geometry": "bohr",
    "geometry_jacobian": "bohr/bohr",
    "reference_conversion": {
      "hartree_to_eV": 27.211386245988,
      "bohr_to_angstrom": 0.529177210903,
      "amu_to_electron_mass": 1822.888486209,
      "au_angular_frequency_to_wavenumber_cm^-1": 219474.6313705
    }
  },
  "presentation": {
    "title": "Human-readable title",
    "description": "Human-readable description"
  },
  "coordinate_definition": {
    "q1_math": "q_1",
    "q2_math": "q_2",
    "q1_label_long": "Long name of q1",
    "q2_label_long": "Long name of q2",
    "q1_definition": "What q1 means physically",
    "q2_definition": "What q2 means physically"
  },
  "grid": {
    "shape": [nq2, nq1],
    "q1_values": [ ... length nq1 ... ],
    "q2_values": [ ... length nq2 ... ]
  },
  "atoms": {
    "symbols": ["C", "H", "H"],
    "bonds": [[0, 1], [0, 2]]
  },
  "fields": {
    "energy_hartree": [ ... shape [nq2, nq1] ... ],
    "gradient_hartree_per_bohr": [ ... shape [nq2, nq1, 2] ... ],
    "hessian_hartree_per_bohr2": [ ... shape [nq2, nq1, 2, 2] ... ],
    "mw_hessian_hartree_per_electron_mass_bohr2": [ ... shape [nq2, nq1, 2, 2] ... ],
    "geometries_bohr": [ ... shape [nq2, nq1, natoms, 3] ... ],
    "geometry_jacobian_bohr_per_bohr": [ ... shape [nq2, nq1, 2, natoms, 3] ... ]
  }
}
```

The field names in this skeleton should be used exactly as written.

---

## 8. Axis conventions in plain language

In this section, use

- $i$ for the index in `grid.q1_values`
- $j$ for the index in `grid.q2_values`
- $a$ for the atom index
- $c \in \{x,y,z\}$ for the Cartesian component

Also define

- $q_{1,i}$ as the value stored at `grid.q1_values[i]`
- $q_{2,j}$ as the value stored at `grid.q2_values[j]`

### 8.1 Energy

Stored lookup:

```text
energy[j][i]
```

Interpretation:

```math
energy[j][i] = E(q_{1,i}, q_{2,j}).
```

### 8.2 Gradient

Stored lookup:

```text
gradient[j][i][alpha]
```

Component convention:

- `alpha = 0`: $\partial E / \partial q_1$
- `alpha = 1`: $\partial E / \partial q_2$

Interpretation:

For `gradient[j][i][0]`:

```math
gradient[j][i][0] = \left.\frac{\partial E}{\partial q_1}\right|_{(q_1,q_2)=(q_{1,i},q_{2,j})}.
```

For `gradient[j][i][1]`:

```math
gradient[j][i][1] = \left.\frac{\partial E}{\partial q_2}\right|_{(q_1,q_2)=(q_{1,i},q_{2,j})}.
```

### 8.3 Hessian

Stored lookup:

```text
hessian[j][i][alpha][beta]
```

Component convention:

- `hessian[j][i][0][0]`: $\partial^2 E / \partial q_1^2$
- `hessian[j][i][0][1]`: $\partial^2 E / (\partial q_1\partial q_2)$
- `hessian[j][i][1][0]`: $\partial^2 E / (\partial q_2\partial q_1)$
- `hessian[j][i][1][1]`: $\partial^2 E / \partial q_2^2$

Interpretation:

The 2 x 2 block `hessian[j][i]` is

```math
\left.
\begin{pmatrix}
\dfrac{\partial^2 E}{\partial q_1^2} & \dfrac{\partial^2 E}{\partial q_1\partial q_2} \\
\dfrac{\partial^2 E}{\partial q_2\partial q_1} & \dfrac{\partial^2 E}{\partial q_2^2}
\end{pmatrix}
\right|_{(q_1,q_2)=(q_{1,i},q_{2,j})}.
```

### 8.4 Geometry

Stored lookup:

```text
geometries[j][i][a][c]
```

Component convention:

- `c = 0`: $x$ component
- `c = 1`: $y$ component
- `c = 2`: $z$ component

Interpretation:

```math
geometries[j][i][a][c] = R_{a,c}(q_{1,i}, q_{2,j}).
```

So `geometries[j][i][a]` is the Cartesian 3-vector of atom $a$ at the reduced-grid point indexed by `i` and `j`.

### 8.5 Geometry Jacobian

Stored lookup:

```text
geometry_jacobian[j][i][alpha][a][c]
```

Component convention:

- `alpha = 0`: $\partial R_{a,c} / \partial q_1$
- `alpha = 1`: $\partial R_{a,c} / \partial q_2$
- `c = 0`: $x$ component
- `c = 1`: $y$ component
- `c = 2`: $z$ component

Interpretation:

For `geometry_jacobian[j][i][0][a][c]`:

```math
geometry\_jacobian[j][i][0][a][c] = \left.\frac{\partial R_{a,c}}{\partial q_1}\right|_{(q_1,q_2)=(q_{1,i},q_{2,j})}.
```

For `geometry_jacobian[j][i][1][a][c]`:

```math
geometry\_jacobian[j][i][1][a][c] = \left.\frac{\partial R_{a,c}}{\partial q_2}\right|_{(q_1,q_2)=(q_{1,i},q_{2,j})}.
```

---

## 9. Practical rules for authors

If you want to make your own dataset for the viewer, follow these rules strictly.

### Rule 1 — Use only two reduced coordinates

Your active reduced space is exactly

```math
(q_1,q_2).
```

Do not try to store a higher-dimensional reduced PES in this schema.

### Rule 2 — Keep all stored numbers in atomic units

Even if your source calculations are in Å, eV, amu, or cm$^{-1}$, convert the stored arrays to the required atomic units before writing JSON.

### Rule 3 — Preserve the exact array order

Always store grid fields as

```text
[q2_index, q1_index, ...]
```

not `[q1_index, q2_index, ...]`.

### Rule 4 — Keep atom ordering fixed everywhere

If `atoms.symbols` is

```json
["C", "O", "H", "H"]
```

then every geometry and every Jacobian entry must use that same atom order.

### Rule 5 — Keep bond indices zero-based

A bond `[i, j]` refers to atom indices in `atoms.symbols`, using Python-style zero-based indexing.

### Rule 6 — Keep Hessians symmetric

The reduced Hessian and mass-weighted Hessian should both be symmetric to numerical precision.

### Rule 7 — Ensure every geometry has shape `natoms x 3`

Every geometry must have one Cartesian 3-vector per atom listed in `atoms.symbols`.

---

## 10. Minimal author workflow

A reliable workflow is:

1. Choose your molecular display atom list and bond list.
2. Define the reduced coordinates $q_1$ and $q_2$.
3. Build arrays `q1_values` and `q2_values` in bohr.
4. For every grid point $(q_1,q_2)$, compute:
   - $E(q_1,q_2)$
   - $\nabla E(q_1,q_2)$
   - $H(q_1,q_2)$
   - $H_{\mathrm{mw}}(q_1,q_2)$
   - $R(q_1,q_2)$
   - $J(q_1,q_2)$
5. Store them in the exact nested order required above.
6. Write the final JSON file.

In pseudocode:

```text
choose nq1, nq2, natoms
build q1_values in bohr
build q2_values in bohr

for j in range(nq2):
    for i in range(nq1):
        q1 = q1_values[i]
        q2 = q2_values[j]

        energy[j, i] = E(q1, q2)
        gradient[j, i, :] = [dE/dq1, dE/dq2]
        hessian[j, i, :, :] = [[d2E/dq1dq1, d2E/dq1dq2],
                               [d2E/dq2dq1, d2E/dq2dq2]]
        mw_hessian[j, i, :, :] = M^(-1/2) H M^(-1/2)
        geometries[j, i, :, :] = R(q1, q2)
        geometry_jacobian[j, i, 0, :, :] = dR/dq1
        geometry_jacobian[j, i, 1, :, :] = dR/dq2
```

---

## 11. Final checklist before loading into the viewer

Before you try a custom dataset in the web viewer, check all of the following:

- `schema_version == 5`
- `storage_unit_family == "atomic_units"`
- `grid.shape == [len(grid.q2_values), len(grid.q1_values)]`
- all grid-based arrays start with `[q2_index, q1_index, ...]`
- `len(atoms.symbols) == natoms`
- every geometry has shape `[natoms, 3]`
- every Jacobian block has shape `[2, natoms, 3]`
- bond indices are valid zero-based indices
- Hessians are symmetric
- units match the exact strings listed above

If all of those are true, your file should be structurally compatible with the current schema.
