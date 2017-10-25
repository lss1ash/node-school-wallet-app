'use strict';

class Database {
	async getAll() {
		return this._db
			.find({})
			.lean()
			.exec();
	}

	async get(id) {
		return this._db
			.findOne({id})
			.lean()
			.exec();
	}

	async getBy(cond) {
		return this._db
			.find(cond)
			.lean()
			.exec();
	}

	/**
	 * Генерирует новый id для записи
	 * @return {Number}
	 * @private
	 */
	async _generateId() {
		const data = await this._db
			.find({})
			.sort({id: -1})
			.limit(1)
			.lean()
			.exec();
		return data[0].id + 1;
	}

	async _insert(item) {
		await this._db
			.create(item);
	}

	async _remove(id) {
		await this._db
			.remove({id});
	}

	async _update(cond, set) {
		await this._db
			.update(cond, {$set: set});
	}
}

module.exports = Database;
