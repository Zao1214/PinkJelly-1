# PinkJelly
Instant-object-recognition && speech App, easy as 1, 2 ,3!

## Quick Start
### Download our App using Expo
https://exp.host/@zao1214/client
(
  if for some reason doesn't work, then it is probably b/c we stopped the server. 
  Give us a notice and we will be happy to re-run the server!
)

### then follow the steps
1. login (Email confirmation required) for signup
2. take a picuture (simple version comes with 200 objects quite accurate, funny comes with 9400 but less accurate)
3. experience the magic (press the circular-object-detected-button and hear its label in English)

!IMPORTANT notice : 
  * currently, machine learning behind simple camera is tiny-yolo
  (current server with 1G memory can only hold tiny; which also means it will crash on funny(yolo9000) camera)
  * In order to change yolo version, code can be found in runDarknet.js where I have written some comment
  * If we replace AWS EC2 server to c4.large, yolo2 and yolo9000 can be used and it will take 8-10 seconds
  * If we replace AWS EC2 server to any GPU server, it takes 3-4 seconds
  * If we change server code to preload weights on server, every process will take 3seconds less, (GPU 0-1seconds)
  (I personally like to have loading section, so I decided not to put weights on)

```
Credit :
Darknet@article{redmon2016yolo9000,
  title={YOLO9000: Better, Faster, Stronger},
  author={Redmon, Joseph and Farhadi, Ali},
  journal={arXiv preprint arXiv:1612.08242},
  year={2016}
}
```
