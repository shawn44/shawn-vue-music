# vue-music

> shawn

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


音乐播放器

需求分析：
	1、头部导航
		推荐   歌手   排行	搜索
		 歌单   歌手   榜单   搜索
	2、播放器内核
	3、迷你播放器
	4、播放列表
	5、添加歌曲到列表
	6、用户中心
	
项目准备
	1、vue-cli 	通过脚手架搭建vue项目框架
		vue init webpack vue-music

项目开始
	重写src项目结构，修改main.js 和 app.vue
	在package中增加stylus 、 stylus-loader
	修改eslint配置
	修改webpack配置
	在webpack。base。cong修改别名alias
	
第三章 骨架编写
	header组件
		修改index，html
		package中增加babel-runtime（es6实时编译）,fastlick(结局移动端点击300毫秒延迟的问题),
						babel-polyfill(es6实时编译补丁)
		main.js
		app.vue引入header组件
		在webpack。base。cong修改别名alias ==》components
	
	配置路由
		在router中添加路由
		在app.vue添加router-view
		引入tab组件
		在路由中重定向 #
				{
				  path: '/',
				  redirect: '/recommend'
				},
	
第四章 推荐页面
	页面均采用线上真实数据，通过jsonp的方式获取数据
	jsonp的原理：
		script标签没有跨云限制，所以动态的加载script标签来解决跨域问题
		本项目采用jsonp的库：github==>webmodules/jsonp
		安装依赖，把jsonp封装成promise对象 
	
	获取推荐页面数据
		封装方法
		准备recommed组件
		把数据加载出来
		
	轮播图组件实现
	    base组件（基础组件，components是业务组件）文件夹，新建轮播组件
		准备好轮播组件
		在recommend引入slider组件
		在slot中插入dom和数据
		优化slider组件：用better-scroll实现 
			使每个图片的宽度等于父及的宽度
			有涉及公共dom操作的写公共js
			使用better-scroll 设置配置
			
		完善轮播
			添加 点击切换控件
				是一个数据，v-for循环这个数组
				添加激活样式
					better-scroll插件中提供事件接口和激活元素接口
			添加 自动轮播
				设置定时器，调用插件接口
				然后在scrollEnd中清除定时器，调用——play（）方法
		
		优化轮播
			当改变窗口宽度的时候，轮播会出现显示问题
				监听window.resize事件
				重新调用_setSliderWidh方法：注意设置标志位，不要每次增加width
				this.slider.refresh()
				
			每次切换路由轮播都会重新加载一次，而且请求也会重新请求一次
				所以要在 <router-view>的外面加上一个<keep-alive></keep-alive>标签
			
			当路由切换的时候，要在destroyed中清除定时器
			
	
	歌曲列表
		抓取数据，
			和getRecommend一样采用jsonp方法，但是服务器返回500错误
			分析原因可能是在qq音乐的请求头中加入了一些东西，referer，host如果没有请求失败
			解决办法：前端没办法直接添加请求头所以借助webpack的server添加路由，在后端进行请求，用到axios库
			
			引入axios，在dev-server中添加express的路由，axios.get（）在后端模拟请求并且伪造header，
			然后在前段通过axios调用自己的接口，把参数穿进去
			
			最新的vue-cli搭建的vue项目中没有了dev-server文件，所以解决办法参考http://blog.csdn.net/qq_34645412/article/details/78833860
	
		歌单列表
			获取数据后绑定数据v-for，列表样式已经提前写好了
			v-html = ‘item.xxx’ 可以帮我们做转义字符编码
			
		scroll组件的抽象和应用
			在base文件夹下新建scroll组件，
			scroll组件靠better-scroll实现
			引入scroll组件并使用，注意要传入data（时机问题），还要在滚动的dom外面加一个div
			scroll优化：
				有一个问题，如果图片加载延迟，滚动或出现不到底的情况
					所以要监听图片的onload事件，当只要有一张图片加载出来的时候从新执行refresh（）并且设置标志为，之执行一次
			引入scroll组件后图片可能点击不了，就要在图片上加上 needsclick的类名 class=‘needsclick’
			
		懒加载插件
			第三发插件vue-lazyload解决图片懒加载的技术
			在main.js引入懒加载插件注册，并配置
			在组件中吧：src 该为 :v-lazy=‘item.imgurl’
		
		loading组件
			准备好loading组件
			加载使用，吧loading组件放在中间，用v-show控制显示隐藏
	
	
第五章	歌手页面
	左右联动布局，jsonp接口
	获取数据
		在api中新建singer.js配置参数调用jsonp，在singer页面中处理
		由于数据不符合使用规则，所以要定义函数处理数据
		对数据进行结构处理，和顺序处理，最后利于使用
	滚动歌手列表
		在base准备组件，组建中使用scroll组件，和v-lazyload解决图片懒加载的技术
		在singer中使用组件，并传入数据
	
		右侧快速入口实现
			在计算属性中正准备数据 v-for 循环快速入口 dom
			绑定ontouchstart事件
				获取点击的第几个元素，调用better-scroll的方法
			绑定ontouchmove事件
				计算移动了多少位置从而得出index
				调用scrollToElement方法 
			联动效果
				对scroll组件进行拓展，监听onscroll事件，返回pos对象
				watch数据变化判断当前pos.y在哪个区间见代码
				ontouchmove没有联动效果
					在_scrollTo的时候手动挡改变scrollY的之实现联动效果，注意边界点
		
		滚动固定标题实现
			一个div固定在上部，绑定数据，注意临界值，控制显示隐藏
			当滚动到边缘的时候，固定标题要有一个往上顶的效果
			见代码（没太明白）
		优化组件加入loading组件
		
		
第六章 歌手详情页面
		配置歌手页面的子页面，路由中传递动态参数
		在listView中绑定点击事件，然后向父级派发事件，把每一个歌手数据传递出去
		this.$router.push({
			path:'/singer/${id}'
		})
		在歌手详情页面中，写上class类，加入vue动画
		
		
		VUEX状态管理多个组件状态共享
			注册vuex
			配置vuex 定义state
					 定义muations
			在页面跳转的时候传递这个state，以及获取变化
		
			
		根据得到的数据获取歌手详情页面的数据
			在singer添加function getsinger
			在singerDETALIL中使用获取歌手详情数据
			注意当没有this.singer.id的时候

		
		创建song类，用于处理歌曲数据，设计成类代码利于维护，和扩展，面向对象 
			let {musicData} = item(????)
			把歌曲数据抽象为类，主要定义属性
			然后单独定义一个new song 的工厂函数用于实例song
			在songDatil中引入并使用，处理好所需要的数据的处理
			
		准备好歌曲列表组件
			定义好props  bgimage 
			从父及传入数据，渲染文案和图片
			
			定义song-list基础组件准备复用
				在base文件夹下新建song-list文件
					写好基础  dom和样式
					{{getDesc 在这里可以写函数}}
		
			使用scroll和song-list组件，传递数据
				动态设置scroll的top
				
				上滑背景图片跟随滚动图片
					在scroll之前添加层height改变他的transform
						控制transform的偏移量不要超过背景图片
						吧title的距离留出来 +40
				下拉背景图片放大效果
					定义变量const percent = Math.abs(newY / this.imageHeight)
							  if (newY > 0) {
								scale = percent + 1
							  }
					修改图片的transfrom：scale
								修改z-index
				上滑背景图片高速模糊效果：只有在高版本手机上才有的效果
					定义变量blur
					修改this.$refs.filter.style['backdrop-filter'] = `blur(${blur})px`
					该style属性为css3属性，高速模糊
			
			优化css签缀功能，封装方法
				检测当前浏览器支持的css前缀支持
				动态设置前缀
		
			添加后退功能
				添加点击事件，后退功能
				
			添加随机播放按钮
				注意控制v-show控制显示隐藏
				然后滚动到顶部不显示，没到顶部显示
				
			添加loading组件，控制v-show
				
第七章 播放器内核页面 	
	首先设置需要用到的数据在vuex中
		playing：false
		fullScreen
		playlist
		sequeceList
		model
		在commom/js中创建config文件，配置项目的一些配置（这是良好的编程习惯）
		  playmode:{
		}
		currentIndex
	设置vuex的getters 

	配置mutation

	准备player组件
	  写好基础样式
	  在app.vue注册该组件
	  通过fullScreen，playlist控制显示隐藏
	  在song-list组件中通过点击和事件改变stats
	  配置actions
	  
	  
	  这里有一个问题
		会报一个错误，研究发现是play组件初始的时候currentList没有数据造成的，解决办法把 <div class="player" v-show="playList.length>0"> 改为v-if
			用对比软件发现是state中playlist，及其他名字写错问题导致，该问题提醒要细心
	  给音乐播放器内核打开关闭添加动画效果	
		添加transition便签没添加name，定义样式
		
	  添加图片飞入效果
		利用vue提供的js动画钩子函数
		利用第三方库create-keyframe-animation实现js实现css3动画
			要学习这个库，以及该动画效果的实现
			
			
		音乐播放功能：
			增加audio标签：绑定src属性：
			watch 数据的变化，当数据发生改变调用audio的play方法
			但是要注意如果src没加载进来调用play方法会报错，所以要延时一下
			用this.$nextTick()方法
			关于$nextTick()方法： https://www.cnblogs.com/duanyue/p/7458340.html
			
			关于qq音乐接口改变的问题，找一一晚上接口，终于在github上找到别人的项目，发现别人的接口是真确的，替换上终于搞定了
		
			给播放按钮添加功能，观察state中playing，动态添加类名
			同样给mini icon添加同样的功能（注意会事件冒泡要阻止）
			
			添加图片旋转的效果，在计算属性中动态添加类名，同样添加给mini图片
			
			前进后退功能，修改state中的currentIndex
				点击按钮添加点击事件
				注意第一首和最后一首的情况
				注意歌曲暂停的时候，点击下一收，要更新playing的状态
				当快速点击的时候，发现会报错，有src加载来不及的情况，利用audio的canplay事件，设置标志位，当标志位为false的时候，不能点击前进后退
				如果歌曲加载错误，由于我们设置了标志位，前进后退功能都会失效，所以要在audio的error事件中把标志位设置为false，
				还要添加不能点击前进后退时的 :class="disableCls"
			
			播放器 播放进度
				准备好dom
				播放器timpUpdata事件，可以获得当前播放事件，是事件戳
				time = time | 0 相当于math。floor ？？
				把时间戳该为 00:00
				从currentSong中获取总时间
			
			进度条
				准备进度条组件，在base下
					写好dom
					动态传入播放百分比，改变进度条的进度
			
				进度条拖动
					监听touchstart，move，end事件，要阻止默认事件
					start ：记录startX，进度条的宽度，设置标志位
					move： deltaX 移动的距离
					end：标志位设为false， 告知父级进度
					
					父及监听事件，改变audio的currentTime
					如果歌曲暂停，拖动位置，改为播放
					
				进度条点击
					添加点击事件，监听e.offsetX
					调用_offset和_triggerPercent方法
					
			mini播放器圆形进度条（经典！！！）
				新建基础组件
					利用svg技术
				把组件引入，并使用
					props动态传入svg的宽高
					:stroke-dasharray="dashArray"  周长？
					:stroke-dashoffset="dashOffset" 周长偏移 
					这样就有圆形进度条的效果
					
					
					
	播放模式
		通过state获取当前mode
		通过计算属性计算icon图标
		添加点击事件切换mode
					
		if随机模式，创建	util。js
			循环列表 （洗牌函数，经典！！！）
					
					
	歌词页面
		歌词数据的抓取
			通过研究返现，该接口需要动态传入歌曲id，但是做了域名限制，需要nodejs做代理
				在api中新建方法
				然后在devserver配置代理接口
			 		
					
					
					
			
			
			
			
			
			
			
			
		
		
		
		
		
		
		
		
		
		
		
		
		
	
	
小知识：数据延迟20m	
	
	
	
	

	