const _ = require('lodash');

function User(_node) {
	_.extend(this, _node.properties);

	
	if (this.name) {
		this.name = this.duration.toString();
	}
	if (this.email) {
		this.email = this.duration.toString();
	}
}

module.exports = User;