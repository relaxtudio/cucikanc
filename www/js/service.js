angular.module('cucikan-service', [])

	.factory('$ls', function ($window) {
		return {
			set: function (key, value) {
				$window.localStorage.setItem(key, value);
			},
			get: function (key, defaultValue) {
				return $window.localStorage.getItem(key) || defaultValue;
			},
			remove: function (key) {
				$window.localStorage.removeItem(key);
			},
			setObject: function (key, value) {
				$window.localStorage.setItem(key, JSON.stringify(value));
			},
			getObject: function (key, defaultValue) {
				return JSON.parse($window.localStorage.getItem(key) || defaultValue);
			}
		};
	})

	.factory('$ws', function($ls, $http, CONFIG) {
		var C_SESSION = CONFIG.APP_ID + '.session';
		var C_CACHE = CONFIG.APP_ID + '.cache';
		var C_SERVER = CONFIG.APP_ID + '.server';
		var C_SERVERNAME = CONFIG.APP_ID + '.servername';
		var C_WS;
		var getServer = function(path) {
			path = path || '';
			return $ls.get(C_SERVER, CONFIG.SERVER) + path;
		};
		var setServer = function(url) {
			$ls.set(C_SERVER, url);
			initServer();
		};
		var setServerName = function(name) {
			$ls.set(C_SERVERNAME, name);
		};
		var getServerName = function() {
			return $ls.get(C_SERVERNAME);
		};
		var initServer = function() {
			C_WS = getServer(CONFIG.API_PHP);
			// console.log(C_WS);
		};
		var getEmailAdmin = function (success, error) {
			$http.post(C_WS + 'getemailadmin').then(success, error);
		};
		var checkUserExist = function (username, success, error) {
			$http.post(C_WS + 'checkUserExist/' + username).then(success, error);
		};
		var register = function (success, error, data) {
			var data64 = sprintf(
				"%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s",
				data.username,	// 0
				data.password,	// 1
				data.email,		// 2
				data.nama,		// 3
				data.gender,	// 4
				data.alamat,	// 5
				data.kota_kab,	// 6
				data.kecamatan,	// 7
				data.telepon 	// 8
			);
			$http.post(C_WS + 'register/' + btoa(data64)).then(success, error);
		};
		var getUsrDetails = function (id, success, error) {
			$http.post(C_WS + 'getusrdetail/' + id).then(success, error);
		};
		var getOrder = function (success, error, filter) {
			filter.mobil = filter.mobil ? filter.mobil : "";
			filter.status = filter.status ? filter.status : "";
			$http.post(C_WS + 'getorder/' + filter.id + '/' + filter.mobil + '/' + filter.status).then(success, error);
			// console.log('getorder/' + filter.id + '/' + filter.mobil + '/' + filter.status);
		};
		var getPaket = function (success, error) {
			$http.post(C_WS + 'getpaket').then(success, error);
		};
		var getBayar = function (success, error) {
			$http.post(C_WS + 'getbayar').then(success, error);
		};
		var getMobil = function (success, error, id) {
			$http.post(C_WS + 'getmobil/' + id).then(success, error);
		};
		var getBrandMobil = function (success, error) {
			$http.post(C_WS + 'getbrandmobil').then(success, error);
		};
		var createOrder = function (success, error, data) {
			data.inv = "INV/" + data.idUser + "/" + data.formatTanggal.replace(/\-/g, "").substring(2) + "/" + data.now.replace(/\:/g, "").substring(2);
			data.order = "Order";
			var data64 = sprintf(
				"%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s",
				data.idUser,		// 0
				data.inv,			// 1
				data.mobilBrand,	// 2
				data.mobilNama,		// 3
				data.pemilik,		// 4
				data.email,			// 5
				data.telepon,		// 6
				data.lokasi,		// 7
				data.formatTanggal,	// 8
				data.formatJam,		// 9
				data.paket,			// 10
				data.pembayaran,	// 11
				data.order,			// 12
				data.mobil,			// 13
				data.namaPaket,		// 14
				data.total,			// 15
				data.adminMail		// 16
			);
			var dataencode = btoa(data64);
			$http.post(C_WS + 'createorder/' + dataencode).then(success, error);
			// console.log(data,data64);
		};
		var cancelOrder = function (success, error, data) {
			$http.post(C_WS + 'cancelOrder/' + data.id_order).then(success, error);
		};
		var createMobil = function (success, error, data) {
			var data64 = sprintf(
				"%s;;%s;;%s;;%s;;%s;;%s;;%s",
				data.idUser,
				data.brand,
				data.jenis,
				data.tahun,
				data.warna,
				data.pemilik,
				data.nopol
			);
			console.log(data64);
			$http.post(C_WS + 'createMobil/' + btoa(data64)).then(success, error);
		};
		var deleteMobil = function (success, error, id) {
			$http.post(C_WS + 'deletemobil/' + id).then(success, error);
		};
		var updateUser = function (success, error, data) {
			var data64 = sprintf(
				"%s;;%s;;%s;;%s;;%s;;%s;;%s;;%s",
				data.id,		// 0
				data.nama,		// 1
				data.gender,	// 2
				data.alamat,	// 3
				data.kota_kab,	// 4
				data.kecamatan,	// 5
				data.telepon,	// 6
				data.email 		// 7
			);
			$http.post(C_WS + 'updateuser/' + btoa(data64)).then(success, error);
		};
		var checkPass = function (success, error, id, pass) {
			$http.post(C_WS + 'checkpass/' + id + '/' + pass).then(success, error);
		};
		var changePassword = function (success, error, id, pass) {
			$http.post(C_WS + 'changepassword/' + id + '/' + pass).then(success, error);
		};

		initServer();

		return {
			getTest: function (success, error, data) {
				data = sprintf(
					"%s;;%s",
					data.nama,
					data.tipe
				);
				$http.post(C_WS + 'gettest/' + btoa(data)).then(success, error);
			},
			login: function (user, success, error) {
				return $http.post(C_WS + 'login/' + user.username + "/" + user.password).then(function (respon) {
					if (respon.data) {
						user = [];
						var id = respon.data;
						// console.log('testing', respon);
						getUsrDetails(respon.data, function (respon) {
							user = respon.data;
							user[0].id = id;
							$ls.setObject(C_SESSION, user[0]);
							console.log(user);
							success(id);
						}, error);
					} else {
						success(respon.data);
					}
				}, error);
			},
			isLogin: function () {
				// console.log(C_SESSION, C_CACHE);
				// console.log('isLogin', $ls.getObject(C_SESSION, null));
				return ($ls.getObject(C_SESSION, null) !== null);
			},
			loginUser: function () {
				// console.log('loginUser', $ls.getObject(C_SESSION, null));
				return $ls.getObject(C_SESSION, null);
			},
			updateSession: function (session) {
				return $ls.setObject(C_SESSION, session);
			},
			logout: function () {
				$ls.remove(C_SESSION);
				$ls.remove(C_CACHE);
			},
			getServer: getServer,
			setServer: setServer,
			getServerName: getServerName,
			setServerName: setServerName,
			getEmailAdmin: getEmailAdmin,
			checkUserExist: checkUserExist,
			register: register,
			getUsrDetails: getUsrDetails,
			getOrder: getOrder,
			getPaket: getPaket,
			getBayar: getBayar,
			getMobil: getMobil,
			getBrandMobil: getBrandMobil,
			createOrder: createOrder,
			deleteMobil: deleteMobil,
			cancelOrder: cancelOrder,
			createMobil: createMobil,
			updateUser: updateUser,
			checkPass: checkPass,
			changePassword: changePassword
		}
	});
