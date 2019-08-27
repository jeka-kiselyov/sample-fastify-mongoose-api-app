import axios from 'axios';

class APICollection {
	constructor(params = {}) {
		console.log(params);
		this._name = params.name || null;
		this._api = params.api || null;
	}

	get axios() {
		return this._api._axios;
	}

	async list(params = {}) {
		let resp = await this.axios.get(this._name, { params: params });
		return resp.data;
	}

	post(data = {}, params = {}) {
		return this.add(data, params);
	}

	async add(data = {}, params = {}) {
		let resp = await this.axios.post(this._name, data, {params: params});
		return resp.data;		
	}

	async edit(data = {}, params = {}) {
		let id = data.id || data._id || null;
		if (!id) {
			throw 'id or _id is required';
		}

		let resp = await this.axios.put(this._name+'/'+id, data, {params: params});
		return resp.data;
	}

	async delete(data = {}) {
		let id = data.id || data._id || null;
		if (!id) {
			throw 'id or _id is required';
		}

		let resp = await this.axios.delete(this._name+'/'+id);
		if (resp && resp.data && resp.data.success) {
			return true;
		} else {
			return false;
		}
	}
}

class API {
	constructor(params = {}) {
		this._baseDomain = params.baseDomain || document.location.origin || null;
		this._basePath = params.basePath || (''+this._baseDomain+'/api');

		this._collections = {};
		this._axios = axios.create({
				baseURL: this._basePath
			});
	}

	getCollection(name) {
		if (this._collections[name]) {
			return this._collections[name];
		} else {
			this._collections[name] = new APICollection({
					name: name,
					api: this
				});

			return this._collections[name];
		}
	}

}

export default API;