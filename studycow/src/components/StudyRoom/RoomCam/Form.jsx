import React from 'react';

function Form({ joinSession, sessionId, sessionIdChangeHandler }) {
	const onSubmitHandler = (event) => {
		event.preventDefault();
		joinSession();
	};

	return (
		<>
			<h1>Join a video session</h1>
			<form onSubmit={onSubmitHandler}>
				<p>
					<input
						type="text"
						value={sessionId}
						onChange={sessionIdChangeHandler}
						minLength={1}
						maxLength={20}
						required
					/>
				</p>
				<p>
					<input type="submit" value="JOIN" />
				</p>
			</form>
		</>
	);
}

export default Form;
