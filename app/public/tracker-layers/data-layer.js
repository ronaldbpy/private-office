class DataStore {
  constructor(initialState = {}) {
    this.state = initialState.records ? initialState : { records: {} };
  }

  read(date) {
    return this.state.records[date] || null;
  }

  write(date, record) {
    this.state.records[date] = { ...record, version: (record.version || 0) + 1 };
    return this.state.records[date];
  }

  exists(date) {
    return date in this.state.records;
  }

  delete(date) {
    delete this.state.records[date];
  }

  toJSON() {
    return { records: this.state.records };
  }
}

export { DataStore };
