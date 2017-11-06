angular.module('cucikan-controllers', ['cucikan-directive'])

.controller('AppCtrl', function($scope, $state, $ionicLoading, $ionicPopup, $ionicModal, $ionicHistory, $timeout, $ws, CONFIG) {

	$scope.BASEPATH = $ws.getServer();
	$scope.SERVERNAME = $ws.getServerName();
	$scope.home = false;
	$scope.init = function () {
		$scope.global = {};
		$scope.CONFIG = CONFIG;
		$scope.global.user = $ws.loginUser();
	};
	$scope.setMenu = function (id) {
		$scope.activeMenu = id;
	};
	$scope.logout = function () {
		$scope.showConfirm('Keluar Aplikasi harus Login kembali. Apakah anda yakin?', function(res) {
			if (res) {
				$scope.doLogout();
			}
		});
	};
	$scope.doLogout = function () {
		$ws.logout();
		$state.transitionTo('login');
		$scope.$on('$ionicView.afterLeave', function () {
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
		});
	};
	$scope.initModals = function (scope) {

	};
	$scope.showAlert = function (msg, callback) {
		var alertPopup = $ionicPopup.alert({
			title: 'Peringatan',
			template: msg
		});
		alertPopup.then(callback);
	};
	$scope.showConfirm = function (msg, callback, opt) {
        var confirmPopup;
        if (opt) {
            confirmPopup = $ionicPopup.show(opt);
        } else {
            confirmPopup = $ionicPopup.confirm({
                title: 'Konfirmasi',
                template: msg
            });
        }

        confirmPopup.then(callback);
    };
	$scope.errorWS = function (msg) {
		var callback = false;
		var filterMsg = msg;
		$scope.hideLoading();
		$scope.showAlert('Operasi ke server gagal!<br/><small><i>' + filterMsg + '</i></small>', callback);
	};
	$scope.showLoading = function () {
		$ionicLoading.show({
			template: 'Loading...'
		});
	};
	$scope.hideLoading = function () {
		$ionicLoading.hide();
	};
	$scope.test = function (e) {
		console.log(e);
	};
	$scope.init();
})

.controller('BlankCtrl', function($scope, $state) {

})

.controller('LoginCtrl', function($scope, $state, $ionicLoading, $ionicPopup, $timeout, $ws, CONFIG) {
	var showAlert = function (msg, callback) {
		var alertPopup = $ionicPopup.alert({
			title: 'Peringatan',
			template: msg
		});
		alertPopup.then(callback);
	};
	var errorWS = function (err) {
		$ionicLoading.hide();
		$scope.state.loginLoading = false;
		var msg = err;
		showAlert(msg);
	};
    $scope.init = function () {
    	$scope.user = {
    		username: '',
    		password: ''
    	};
    	$scope.state = {
    		loginReady: false,
    		loginLoading: false,
			server: $ws.getServer()
    	};
    };
    $scope.initWs = function () {
    	$scope.init();
    };
    $scope.login = function (form) {
    	$scope.hassubmit = true;
    	// console.log($scope.user);
    	if (form.$valid) {
    		$scope.state.loginLoading = true;
    		$ionicLoading.show();
	    	$ws.login($scope.user, function (respon) {
	    		if (respon) {
	    			// window.setTimeout(function () {
	    				return $ws.getUsrDetails(respon, function (respon) {
		    				if (respon.data) {
		    					$ionicLoading.hide();
		    					$state.transitionTo("app.details");
		    				}
		    			}, errorWS);
	    			// }, 1000);
	    		} else {
	    			$scope.state.loginLoading = false;
	    			$ionicLoading.hide();
	    			showAlert("Username atau Password salah!!");
	    		}
	    	}, errorWS);
    	}
    };

    // $scope.initWs();
    $scope.init();
    $scope.$on('$ionicView.enter', function (e) {
    	$scope.initWs();
    });
})

.controller('SignupCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $timeout, $ws, CONFIG) {
	var showAlert = function (msg, callback) {
		var alertPopup = $ionicPopup.alert({
			title: 'Peringatan',
			template: msg
		});
		alertPopup.then(callback);
	};
	var errorWS = function (err) {
		$ionicLoading.hide();
		$scope.state.loginLoading = false;
		var msg = err;
		showAlert(msg);
	};
	$scope.init = function () {
		$scope.user = {gender: 'pria'};
	};
	$scope.initWs = function () {

	};
	$scope.checkUserExist = function () {
		if ($scope.user.username) {
			$ionicLoading.show();
			$ws.checkUserExist($scope.user.username, function (respon) {
				$ionicLoading.hide();
				if (!respon.data) {
					$scope.userAlert = false;
					$scope.showPass = true;
				} else {
					$scope.userAlert = true;
					$scope.showPass = false;
					delete $scope.user.password;
					delete $scope.user.cekpassword;
				}
			}, errorWS);
		} else {
			$scope.userAlert = false;
			$scope.showPass = false;
			delete $scope.user.password;
			delete $scope.user.cekpassword;
		}
	};
	$scope.checkPass = function () {
		if ($scope.user.password && $scope.user.cekpassword) {
			if ($scope.user.password == $scope.user.cekpassword) {
				$scope.showProfile = true;
				$scope.passAlert = false;
			} else {
				$scope.passAlert = true;
				$scope.showProfile = false;
			}
		}
	}
	$scope.reset = function () {
		$scope.user = {};
		$scope.userAlert = false;
		$scope.passAlert = false;
		$scope.showPass = false;
		$scope.showProfile = false;
	};
	$scope.submitForm = function (form) {
		// console.log(form);
		$ionicLoading.show();
		if (form.$valid) {
			// console.log($scope.user);
			$ws.register(function (respon) {
				console.log(respon);
				if (respon.data) {
					console.log(respon);
					$ionicLoading.hide();
					showAlert("Proses registrasi berhasil. Kembali ke halaman depan.", function () {
						$state.transitionTo('blank');
					});
				}
			}, errorWS, $scope.user);
		} else {
			$ionicLoading.hide();
			showAlert("Data wajib diisi semua dan periksa kevalidannya", function () {
				console.log('callback');
			});
		}
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})

.controller('ForgotCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $timeout, $ws, CONFIG) {
	var showAlert = function (msg, callback) {
		var alertPopup = $ionicPopup.alert({
			title: 'Peringatan',
			template: msg
		});
		alertPopup.then(callback);
	};
	var errorWS = function (err) {
		$ionicLoading.hide();
		$scope.state.loginLoading = false;
		var msg = err;
		showAlert(msg);
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})

.controller('DetailsCtrl', function ($scope, $ws) {
	$scope.init = function () {
		$scope.user = $scope.$parent.global.user;
		$scope.currency = '';
		$scope.order = [];
		$scope.orderByPage = [];
		$scope.showOrder = [];
		$scope.maxPage = 1;
		$scope.curPage = 0;
		$scope.detail = false;
		$scope.filter = {
			id: $scope.user.id
		};
		$scope.listMobil = [];
		// console.log($scope.user);
	};
	$scope.initWs = function () {
		$scope.$parent.home = true;
		$scope.detailOrder($scope.filter);
	};
	$scope.searchOrder = function () {
		// console.log($scope.filter);
		$scope.detailOrder($scope.filter);
		$scope.filter = {
			id: $scope.user.id
		};
	};
	$scope.detailOrder = function(filter) {
		$scope.order = [];
		$scope.$parent.showLoading();
		$ws.getMobil(function(respon) {
			// console.log(respon.data);
			$scope.listMobil = respon.data;
		}, $scope.$parent.errorWS, $scope.$parent.global.user.id);
		$ws.getOrder(function(respon) {
			$scope.orderByPage = [];
			$scope.showOrder = [];
			if (respon.data.length > 0) {
				var limit = 4;
				$scope.order = respon.data;
				$scope.maxPage = parseInt($scope.order.length / limit) + 1;
				var tmpOrder = [];
				$scope.order.forEach(function (val, z) {
					tmpOrder.push(val);
					// console.log(z, tmpOrder, $scope.orderByPage, $scope.order.length);
					if (z == limit - 1 || $scope.order.length == z + 1) {
						$scope.orderByPage.push(tmpOrder);
						$scope.showThisPage(0);
						// console.log('fizz');
						tmpOrder = [];
					}
					if ($scope.order.length == z + 1) {
						$scope.$parent.hideLoading();
					}
				});
				$scope.currency = 'IDR';
			} else {
				$scope.currency = '';
				$scope.showOrder.push({
					tanggal: 'tidak ada data yang ditemukan..'
				});
				$scope.$parent.hideLoading();
			}
		}, $scope.$parent.errorWS, filter);
	};
	$scope.cancelOrder = function (order) {
		$scope.$parent.showConfirm("Apakah anda yakin membatalkan pesanan ini?", function (res) {
			// console.log(res);
			if (res) {
				// console.log(order);
				$ws.cancelOrder(function (respon) {
					// console.log(respon);
					$scope.initWs();
				}, $scope.$parent.errorWS, order);
			}
		});
	}
	$scope.showThisPage = function (page) {
		$scope.showOrder = $scope.orderByPage[page];
		// console.log($scope.showOrder);
	};
	$scope.prevPage = function () {
		if ($scope.curPage > 0) {
			$scope.curPage = $scope.curPage - 1;
			$scope.showThisPage($scope.curPage);
		}
	};
	$scope.nextPage = function () {
		if ($scope.curPage < $scope.maxPage - 1) {
			$scope.curPage = $scope.curPage + 1;
			$scope.showThisPage($scope.curPage);
		}
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})

.controller('OrderCtrl', function ($scope, $ws, $state) {
	$scope.init = function () {
		$scope.$parent.home = true;
		$scope.$parent.setMenu(2);
		$scope.tmpUser = $scope.$parent.global.user;
		$scope.trans = {
			idUser: $scope.tmpUser.id,
			pemilik: $scope.tmpUser.nama,
			email: $scope.tmpUser.email,
			telepon: $scope.tmpUser.telepon,
			lokasi: $scope.tmpUser.alamat,
			total: 0
		};
		$scope.listPaket = [];
		$scope.listPembayaran = [];
		$scope.listMobil = [];
		$scope.togglePemesan = false;
	};
	$scope.initWs = function () {
		$scope.$parent.showLoading();
		$ws.getEmailAdmin(function (respon) {
			console.log(respon);
			$scope.trans.adminMail = respon.data.email;
		}, $scope.$parent.errorWS);
		$ws.getPaket(function (respon) {
			if (respon.data.length <= 0) {
				$scope.$parent.hideLoading();
				$scope.$parent.showAlert("Maaf kami belum membuka layanan ini.", 
					function () {
						$state.transitionTo('app.home');
					});
			}
			$scope.listPaket = respon.data;
			$ws.getBayar(function (respon) {
				if (respon.data.length <= 0) {
					$scope.$parent.hideLoading();
					$scope.$parent.showAlert("Maaf kami belum membuka layanan ini.", 
						function () {
							$state.transitionTo('app.home');
						});
				}
				$scope.listPembayaran = respon.data;
				$ws.getMobil(function (respon) {
					// console.log(respon);
					// $scope.$parent.hideLoading();
					if (respon.data.length <= 0) {
						$scope.$parent.hideLoading();
						$scope.$parent.showAlert("Uh--Oh <br> Sepertinya anda belum memasukkan data Mobil. <br> Tekan OK untuk memasukkan data mobil.", 
							function () {
								$state.transitionTo('app.mobil');
							});
					}
					$scope.$parent.hideLoading();
					$scope.listMobil = respon.data;
				}, $scope.$parent.errorWS, $scope.$parent.global.user.id);
			}, $scope.$parent.errorWS);
		}, $scope.$parent.errorWS);
	};
	$scope.changeMobil = function () {
		$scope.listMobil.forEach(function (value) {
			if (value.id == $scope.trans.mobil) {
				$scope.trans.mobilNama = value.jenis;
				$scope.trans.mobilBrand = value.brand;
			}
		});
	};
	$scope.changePaket = function () {
		$scope.listPaket.forEach(function (value) {
			if (value.id_paket == $scope.trans.paket) {
				$scope.trans.namaPaket = value.nama_paket;
			}
		})
	}
	$scope.calcTotal = function () {
		// console.log($scope.trans.paket);
		$scope.listPaket.forEach(function (value) {
			if (value.id_paket == $scope.trans.paket) {
				$scope.trans.total = value.harga;
			}
		});
	};
	$scope.formatDate = function (date) {
		var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	};
	$scope.formatHour = function (date) {
		var d = new Date(date),
		hour = '' + (d.getHours()),
		minute = '' + (d.getMinutes()),
		second = '' + (d.getSeconds());

		if (hour.length < 2) hour = '0' + hour;
		if (minute.length < 2) minute = '0' + minute;
		if (second.length < 2) second = '0' + second;

		return [hour, minute, second].join(':');
	}
	$scope.checkOrder = function (form) {
		if (form.$valid) {
			var tgl = $scope.trans.tanggal;
			var jam = $scope.trans.jam;
			var tglplsjam = new Date(tgl.setHours(tgl.getHours()+jam.getHours()));
			var limit = new Date(new Date().setHours(new Date().getHours()+8));
			// console.log(limit, tglplsjam);
			if (limit < tglplsjam) {
				// console.log('bisa');
				// $scope.trans = {};
				// console.log($scope.formatDate(tgl), $scope.formatHour(jam));
				$scope.trans.formatJam = $scope.formatHour($scope.trans.jam);
				$scope.trans.formatTanggal = $scope.formatDate($scope.trans.tanggal);
				$scope.trans.now = $scope.formatHour(new Date());
				$scope.submitOrder($scope.trans);
			} else {
				// console.log('tydack bisa');
				tglplsjam = '';
				$scope.$parent.showAlert('Pilihan waktu pelayanan minimal adalah h+8 jam dari waktu saat ini.');
			}
		} else {
			$scope.$parent.showAlert("Data Harus Diisi Semua");
		}
	};
	$scope.submitOrder = function (data) {
		console.log(data);
		$ws.createOrder(function (respon) {
			console.log(respon);
			if (respon.data) {
				$scope.$parent.showConfirm("Pemesanan telah di proses. Apakah anda ingin kembali ke halaman utama?", function (res) {
					if (res) {
						$state.transitionTo("app.details");
					} else {
						$scope.init();
						$scope.initWs();
					}
				})
			} else {
				$scope.$paremt.showAlert("Pemesanan tidak bisa diproses. Pastikan anda terhubung dengan jaringan internet.")
			}
		}, $scope.$parent.errorWS, data);
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})

.controller('MobilCtrl', function ($scope, $ws, $state) {
	$scope.init = function () {
		$scope.$parent.home = true;
		$scope.listMobil = [];
		$scope.mobil = {};
		$scope.mobilDetail = false;
	};
	$scope.initWs = function () {
		$ws.getMobil(function (respon) {
			$scope.listMobil = respon.data;
			console.log($scope.listMobil)
		}, $scope.$parent.errorWS, $scope.$parent.global.user.id);
	};
	$scope.submitMobil = function (form) {
		if (form.$valid) {
			$ws.getTest(function (respon) {
				// console.log(respon);
			}, $scope.$parent.errorWS, $scope.mobil);
		}
	};
	$scope.addMobil = function () {
		$state.transitionTo('app.mobilform')
	};
	$scope.deleteMobil = function (mobil) {
		console.log(mobil);
		$scope.$parent.showConfirm("Apakah anda yakin akan menghapus " + mobil.brand + " " + mobil.jenis + "?", function (res) {
			if (res) {
				$scope.$parent.showLoading();
				$ws.deleteMobil(function (respon) {
					console.log(respon);
					$scope.$parent.hideLoading();
					$ws.getMobil(function (respon) {
						$scope.listMobil = respon.data;
						console.log($scope.listMobil)
					}, $scope.$parent.errorWS, $scope.$parent.global.user.id);
				}, $scope.$parent.errorWS, mobil.id);
			}
		});
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})

.controller('MobilFormCtrl', function ($scope, $ws, $state) {
	$scope.init = function () {
		$scope.$parent.home = false;
		$scope.tmpUser = $scope.$parent.global.user;
		$scope.filter = {brand: ''};
		$scope.brandMobil = [];
		$scope.search = {};
		$scope.mobil = {
			idUser: $scope.tmpUser.id,
			pemilik: $scope.tmpUser.nama
		};
		// $scope.searchResultBrand = [];
	};
	$scope.initWs = function () {
		$scope.$parent.showLoading();
		$ws.getBrandMobil(function (respon) {
			// console.log(respon.data);
			$scope.brandMobil = respon.data;
			$scope.$parent.hideLoading();
		});
	};
	$scope.searchMobilOff = function (key) {
		console.log(key);
		$scope.search.ResultBrand = [];
		for (i in $scope.brandMobil) {
			if ($scope.brandMobil[i].nama.toLowerCase().indexOf(key.toLowerCase()) > -1) {
				$scope.search.ResultBrand.push($scope.brandMobil[i]);
				// console.log($scope.search.ResultBrand);
			}
		}
	};
	$scope.changeBrand = function () {
		delete $scope.mobil.brand;
	};
	$scope.clearSearch = function () {
		$scope.search = {};
		$scope.filter = {};
	};
	$scope.setBrand = function (res) {
		$scope.mobil.brand = res.nama;
		$scope.clearSearch();
		console.log(res);
	};
	$scope.submitMobil = function (form) {
		console.log(form, $scope.mobil);
		if (!form.$valid) {
			$scope.$parent.showAlert("Data harus diisi semua");
		} else {
			if (!$scope.mobil.brand) {
				$scope.$parent.showAlert("Brand masih kosong");
			} else {
				$ws.createMobil(function (respon) {
					console.log(respon.data);
					$scope.$parent.showAlert("Data mobil berhasil disimpan.", function () {
						$state.transitionTo('app.mobil');
					})
				}, $scope.$parent.errorWS, $scope.mobil);
			}
		}
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})

.controller('ProfileCtrl', function ($scope, $ws, $state) {
	$scope.init = function () {
		$scope.$parent.home = true;
		$scope.tmpUser = $scope.$parent.global.user;
		$scope.userProfile = {
			nama: $scope.tmpUser.nama,
			gender: $scope.tmpUser.gender,
			telepon: $scope.tmpUser.telepon,
			alamat: $scope.tmpUser.alamat,
			kecamatan: $scope.tmpUser.kecamatan,
			kota_kab: $scope.tmpUser.kota_kab,
			id: $scope.tmpUser.id,
			email: $scope.tmpUser.email
		};
	};
	$scope.initWs = function () {
		console.log($scope.tmpUser);
	};
	$scope.gotoPass = function () {
		$state.transitionTo('app.pass');
	};
	$scope.updateProfile = function (form) {
		if (form.$valid) {
			$scope.$parent.showLoading();
			// console.log(form.$valid, $scope.userProfile);
			$ws.updateUser(function (respon) {
				// console.log(respon);
				if (respon.data) {
					// console.log($scope.$parent.global.user);
					$ws.getUsrDetails($scope.$parent.global.user.id, function (respon) {
						var tmp = respon.data[0];
						$scope.$parent.global.user = tmp;
						$scope.$parent.global.user.id = $ws.loginUser().id;
						// console.log($scope.$parent.global.user);
						$ws.updateSession($scope.$parent.global.user);
					}, $scope.$parent.errorWS);
				}
				$scope.$parent.hideLoading();
			}, $scope.$parent.errorWS, $scope.userProfile);
		}
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})

.controller('PassCtrl', function ($scope, $ws, $state) {
	$scope.init = function () {
		$scope.$parent.home = false;
		$scope.pass = {};
	};
	$scope.initWs = function () {

	};
	$scope.checkPass = function () {
		$scope.$parent.showLoading();
		$ws.checkPass(function (respon) {
			$scope.$parent.hideLoading();
			// console.log(respon);
			if (respon.data) {
				$scope.enableChange = true;
			} else {
				$scope.enableChange = false;
				$scope.$parent.showAlert("Password salah");
			}
		}, $scope.$parent.errorWS, $scope.global.user.id, $scope.pass.oldPass);
	};
	$scope.changePassword = function (form) {
		if (form.$valid) {
			if ($scope.pass.newPass == $scope.pass.cekPass) {
				$scope.$parent.showLoading();
				$ws.changePassword(function (respon) {
					if (respon.data) {
						$scope.$parent.hideLoading();
						$scope.$parent.showConfirm("Data telah diperbarui. Apakah ingin kembali ke halaman Profil?", function (res) {
							if (res) {
								$state.transitionTo('app.profile');
							} else {
								$scope.pass = {};
							}
						})
					}
				}, $scope.$parent.errorWS, $scope.global.user.id, $scope.pass.newPass);
			} else {
				$scope.$parent.showAlert("Password tidak sama");
			}
		}
	};
	$scope.init();
	$scope.$on('$ionicView.enter', function (e) {
		$scope.initWs();
	});
})
;
