'use strict';

class Collection {
  constructor(model) {
    this.model = model;
  }

  parse(entity) {
    return entity;
  }

  get(id) {
    return this.model.findById(id).then((e) => this.parse(e) || this.create(id));
  }

  create(id) {
    return this.model.create({ _id: id }).then(this.parse);
  }

  edit(id, entity) {
    return this.model.updateOne({ _id: id }, entity);
  }

  remove(id) {
    return this.model.findById(id).then((i) => this.model.deleteOne(i)).then(this.parse);
  }
}

module.exports = Collection;
