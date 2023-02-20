import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  engineers = [
    {
      name: "Joana",
      id:1,
      hero: 'Great to be here',
      avatar: 'https://static.vecteezy.com/system/resources/thumbnails/001/993/889/small/beautiful-latin-woman-avatar-character-icon-free-vector.jpg',
      bio: "I have been a web/software developer for the past 5 years both as a freelancer, hobbyist, intern and a full-time employee. My natural strengths are curiosity and eagerness to learn and this has led me to look at interesting websites and try to replicate their functionality in areas such as design",
      searchStatus: {
        activelylooking: true
      }
    },
    {
      name: "Lee",
      id:2,
      hero: 'Senior Angular dev',
      avatar: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375__340.png',
      bio: "As a full-stack developer with a strong focus on Ruby on Rails, I have a deep understanding of how to build and maintain high-quality, scalable web applications. I am constantly striving to improve my skills and stay up-to-date with the latest technologies, which allows me to bring new and innovative solutions to the table.",
      searchStatus: {
        activelylooking: true
      }
    },
    {
      name: "Ahmad",
      id:3,
      hero: 'Junior Angular dev',
      avatar: 'https://img.freepik.com/free-icon/athlete_318-186007.jpg',
      bio: "As a full-stack developer with a strong focus on Ruby on Rails, I have a deep understanding of how to build and maintain high-quality, scalable web applications. I am constantly striving to improve my skills and stay up-to-date with the latest technologies, which allows me to bring new and innovative solutions to the table.",
      searchStatus: {
        activelylooking: true
      }
    },
  ]
}
