let vm = new Vue({
	el:'#notebook',
	data(){
		return {
			// content:`This is a note.I'm in **bold**.`,
			notes:JSON.parse(localStorage.getItem('notes'))||[],
			selectedId:localStorage.getItem('selected-id')||null,
			
		}
	},
	computed:{
		notePreview(){
			// return marked(this.content);
			return this.selectedNote?marked(this.selectedNote.content):'';
		},
		addButtonTitle(){
			return this.notes.length + ' note(s) already'
		},
		selectedNote(){
			return this.notes.find(note=>note.id===this.selectedId);
		},
		sortedNotes(){
			return this.notes.slice().sort((a,b)=>a.created-b.created).sort((a,b)=>(a.favorite===b.favorite)?0:a.favorite?-1:1);
		},
		linesCount(){
			if(this.selectedNote){
				return this.selectedNote.content.split(/\r\n|\r|\n/).length;
			}
		},
		wordsCount(){
			if(this.selectedNote){
				let s = this.selectedNote.content;
				//将换行符转为空格
				s = s.replace(/\n/g,' ')
				//排除开头和结尾的空格
				.replace(/^\s*|\s*$/gi,'')
				//将多个重复空格转换为一个
				.replace(/\s\s+/gi,' ');
				return s.split(' ').length;
			}
		},
		charactersCount(){
			if(this.selectedNote){
				return this.selectedNote.content.split('').length;
			}
		}
	},
	methods:{
		addNote(){
			const time = Date.now();
			const note = {
				id:String(time),
				title:'New note ' + (this.notes.length + 1),
				content:'**Hi!** This notebook is using [markdown] for formatting!',
				created:time,
				favorite:false,
				
			};
			this.notes.push(note);
		},
		/* saveNote(val){
			localStorage.setItem('content',val);
		}, */
		saveNotes(notes){
			localStorage.setItem('notes',JSON.stringify(this.notes));
		},
		selectNote(note){
			this.selectedId = note.id;
		},
		removeNote(){
			if(this.selectedNote&&confirm('Delete the note?')){
				this.notes.splice(this.notes.indexOf(this.selectedNote),1);
			}
		},
		favoriteNote(){
			this.selectedNote.favorite = !this.selectedNote.favorite;
		}
	},
	watch:{
		// content:'saveNote'
		notes:{
			handler:'saveNotes',
			deep:true
		},
		selectedId(val){
			localStorage.setItem('selected-id',val);
		}
	},
	created() {
		this.content = localStorage.getItem('content')||'You can write in ** markdown **';
	}
});