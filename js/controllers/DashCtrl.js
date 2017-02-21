bandmates.controller('DashCtrl', function($scope, user, AuthFactory, CalFactory, BandFactory, $cordovaToast, $cordovaSocialSharing) {

	 $scope.userBandNames =  []
	 $scope.events = []
	 $scope.giveUp = false;
	 $scope.name;
	 $scope.now;
	 $scope.scrolled = false;

	 $scope.loadMore = function() {
	 	$scope.scrolled = !$scope.scrolled;
	 }

	 $scope.share = function(title, type, location, time, bandName) {
	 	let message = bandName + ' ' + title + ' ' + type + ' ' + location +  ' @' + time
	 	alert(message)
	 	  $cordovaSocialSharing
		    .share(message) // Share via native share sheet
		    .then(function(result) {
		      alert('success', message)
		    }, function(err) {
		     alert('error', err)
		    });
	 }

	 $scope.firstTime = AuthFactory.getFirstTime()
 		if ($scope.firstTime === true) {
	 		setTimeout(function() {
	 			$cordovaToast.show('Welcome to Bandmates! Find Your Band Here or you can go the Register Band Page. Enjoy!', 'long', 'bottom')
	 			$scope.openModal(1)
	 			$scope.$apply()
	 		}, 2000)	 		
	 		setTimeout(function() {
		 			AuthFactory.setFirstTime(false)
		 		}, 5000)
 		}


	 setTimeout(function() {
	 	$scope.$apply()
	 	if ($scope.userBandNames.length == 0) {
	 		$scope.enter()
	 		setTimeout(function() {
	 			if ($scope.firstTime !== true) {
	 			$cordovaToast.show('Join/Create Your Band!', 'long', 'bottom')
	 			$scope.openModal(1)
	 			}
		 		$scope.giveUp = true
	 		}, 2000)
	 	}
	 }, 3000)

 	$scope.dateFilter = function(date){
 		return new Date(date)
 	}

 	$scope.showDets = function(event) {
    	$ionicSlideBoxDelegate.next();
 	} 

 	$scope.enter = function() {
		 $scope.$on('$ionicView.enter', function(e) {
		    $scope.user = user
			AuthFactory.getUserPic(user.uid)
				.then(function(val) {
					$scope.userArray = Object.keys(val).map(function(key) {
						return val[key]
					})
					$scope.name = $scope.userArray[0].firstName + $scope.userArray[0].lastName
				})
				.then(function() {
					BandFactory.getBands(user.uid, $scope.name)
				.then(function(val) {
					$scope.userBands = Object.keys(val).map(function(key) {
						return val[key]
					})
					$scope.userBands.forEach(function(band) {
						$scope.userBandNames.push(band.bandName)
					})
				})
				.then(function() {
					$scope.userBandNames.forEach(function(band) {
						CalFactory.getUserBandsEvents(band)
						.then(function(val) {
							 Object.keys(val).map(function(key) {
								let date = new Date(val[key].startTime)
								$scope.now = new Date()
								if (date.getMinutes() < 10) {
									val[key].time = date.getHours() + ': 0' + date.getMinutes() 
								} else {
									val[key].time = date.getHours() + ': ' + date.getMinutes() 	
								}
								val[key].startTime = date.toDateString();
								$scope.events.push(val[key]);
							})
						})
					})
				})
			})
		});
 	}

 	$scope.enter()
})
