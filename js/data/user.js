new Vue({
  el: '#user',
  data() {
	return {
		uid: 'hym',
		nickName: '老韩头',
	}
  },
  mounted() {
	console.log('mount user')
    if (localStorage.getItem("user")) {
      this.uid = localStorage.getItem("user");
	  console.log(this.uid);
    }
	console.log('mounted end')
  },
  watch() {
	console.log('watch user');
  }
});