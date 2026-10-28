// CRUD genérico sobre la base de datos en memoria. Cada operación es pura:
// recibe la base y devuelve una base nueva (no muta el objeto original).

export class NotFoundError extends Error {}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function listRecords(db, collection) {
  return db[collection] ?? [];
}

// Leer: devuelve el registro o null.
export function findRecord(db, collection, id) {
  return listRecords(db, collection).find((record) => record.id === id) ?? null;
}

// Crear: añade un registro con el id indicado.
export function createRecord(db, collection, data, id) {
  if (findRecord(db, collection, id)) {
    throw new Error(`Ya existe un registro con id ${id} en ${collection}.`);
  }
  const record = { ...data, id };
  return {
    db: { ...db, [collection]: [...listRecords(db, collection), record] },
    record,
  };
}

// Actualizar: fusiona el patch con el registro existente.
export function updateRecord(db, collection, id, patch) {
  const current = findRecord(db, collection, id);
  if (!current) throw new NotFoundError(`No existe ${collection}/${id}.`);
  const record = { ...current, ...patch, id };
  return {
    db: {
      ...db,
      [collection]: listRecords(db, collection).map((item) => (item.id === id ? record : item)),
    },
    record,
  };
}

// Eliminar: quita el registro indicado.
export function deleteRecord(db, collection, id) {
  if (!findRecord(db, collection, id)) throw new NotFoundError(`No existe ${collection}/${id}.`);
  return {
    ...db,
    [collection]: listRecords(db, collection).filter((item) => item.id !== id),
  };
}
